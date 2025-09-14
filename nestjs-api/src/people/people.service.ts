import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { People } from './people.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
    private activityLogService: ActivityLogService,
  ) {}

  async findAll(): Promise<People[]> {
    return this.peopleRepository.find({
      relations: ['father', 'children'],
    });
  }

  async findOne(id: number): Promise<People | null> {
    return this.peopleRepository.findOne({
      where: { id },
      relations: ['father', 'children'],
    });
  }

  async create(peopleData: Partial<People>, ipAddress?: string, userAgent?: string): Promise<People> {
    // Generate unique registration code
    const registrationCode = await this.generateUniqueRegistrationCode();
    
    const people = this.peopleRepository.create({
      ...peopleData,
      registration_code: registrationCode,
    });
    
    const savedPeople = await this.peopleRepository.save(people);
    
    // If this is a spouse, update the current person's spouse_id
    if (peopleData.spouse_id) {
      await this.peopleRepository.update(peopleData.spouse_id, {
        spouse_id: savedPeople.id,
      });
      
      // Log the family member addition for the current person
      await this.activityLogService.logFamilyMemberAdded(
        peopleData.spouse_id,
        savedPeople,
        ipAddress,
        userAgent,
      );
    }
    
    // If this is a child, log the family member addition for the father
    if (peopleData.father_id) {
      await this.activityLogService.logFamilyMemberAdded(
        peopleData.father_id,
        savedPeople,
        ipAddress,
        userAgent,
      );
    }
    
    return savedPeople;
  }

  private async generateUniqueRegistrationCode(): Promise<string> {
    let code: string = '';
    let isUnique = false;
    
    while (!isUnique) {
      // Generate a 6-digit code with prefix "REG"
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      code = `REG${randomNumber}`;
      
      // Check if code already exists
      const existingPerson = await this.peopleRepository.findOne({
        where: { registration_code: code }
      });
      
      if (!existingPerson) {
        isUnique = true;
      }
    }
    
    return code;
  }

  async update(id: number, peopleData: Partial<People>): Promise<People> {
    await this.peopleRepository.update(id, peopleData);
    const updatedPeople = await this.findOne(id);
    if (!updatedPeople) {
      throw new NotFoundException(`People with ID ${id} not found`);
    }
    return updatedPeople;
  }

  async remove(id: number): Promise<void> {
    await this.peopleRepository.delete(id);
  }

  // Get all people with their fathers
  async findAllWithFathers(): Promise<People[]> {
    return this.peopleRepository.find({
      relations: ['father'],
    });
  }

  // Get all people with their children
  async findAllWithChildren(): Promise<People[]> {
    return this.peopleRepository.find({
      relations: ['children'],
    });
  }

  // Get people by father_id
  async findByFatherId(fatherId: number): Promise<People[]> {
    return this.peopleRepository.find({
      where: { father_id: fatherId },
      relations: ['father', 'children'],
    });
  }

  // Get people without father (root level)
  async findRootPeople(): Promise<People[]> {
    return this.peopleRepository.find({
      where: { father_id: IsNull() },
      relations: ['children'],
    });
  }

  // Find person by registration code
  async findByRegistrationCode(registrationCode: string): Promise<People | null> {
    return this.peopleRepository.findOne({
      where: { registration_code: registrationCode },
      relations: ['father', 'children'],
    });
  }

  // Get immediate family members (father, spouse, children)
  async getImmediateFamily(personId: number): Promise<{
    person: People;
    father?: People;
    spouse?: People;
    children: People[];
  }> {
    const person = await this.peopleRepository.findOne({
      where: { id: personId },
      relations: ['father', 'spouse', 'children'],
    });

    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    return {
      person,
      father: person.father,
      spouse: person.spouse,
      children: person.children || [],
    };
  }

  // Get family tree for a person
  async getFamilyTree(personId: number): Promise<People[]> {
    // Get all people with their relations
    const allPeople = await this.peopleRepository.find({
      relations: ['father', 'spouse', 'children'],
    });

    const person = allPeople.find(p => p.id === personId);
    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    // Get all family members including the person themselves
    const familyMembers: People[] = [person];
    const processedIds = new Set<number>([personId]);
    
    // Add father and his family
    if (person.father && !processedIds.has(person.father.id)) {
      familyMembers.push(person.father);
      processedIds.add(person.father.id);
      
      // Add father's spouse (if different from current person)
      if (person.father.spouse && !processedIds.has(person.father.spouse.id)) {
        familyMembers.push(person.father.spouse);
        processedIds.add(person.father.spouse.id);
      }
    }
    
    // Add spouse and spouse's family
    if (person.spouse && !processedIds.has(person.spouse.id)) {
      familyMembers.push(person.spouse);
      processedIds.add(person.spouse.id);
      
      // Add spouse's father
      if (person.spouse.father && !processedIds.has(person.spouse.father.id)) {
        familyMembers.push(person.spouse.father);
        processedIds.add(person.spouse.father.id);
      }
    }
    
    // Add children and their spouses
    if (person.children && person.children.length > 0) {
      for (const child of person.children) {
        if (!processedIds.has(child.id)) {
          familyMembers.push(child);
          processedIds.add(child.id);
          
          // Add child's spouse
          if (child.spouse && !processedIds.has(child.spouse.id)) {
            familyMembers.push(child.spouse);
            processedIds.add(child.spouse.id);
          }
        }
      }
    }

    return familyMembers;
  }

  // Add spouse to a person
  async addSpouse(
    personId: number,
    spouseData: { name: string; last_name: string },
    ipAddress?: string,
    userAgent?: string,
  ): Promise<People> {
    const person = await this.findOne(personId);
    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    // Create spouse
    const spouse = await this.create({
      name: spouseData.name,
      last_name: spouseData.last_name,
      spouse_id: personId,
    }, ipAddress, userAgent);

    // Update person's spouse_id
    await this.peopleRepository.update(personId, {
      spouse_id: spouse.id,
    });

    // Log the activity
    await this.activityLogService.logFamilyMemberAdded(
      personId,
      spouse,
      ipAddress,
      userAgent,
    );

    return spouse;
  }

  // Complete profile for a person
  async completeProfile(personId: number, profileData: {
    birth_date?: Date;
    birth_place?: string;
    job?: string;
    current_location?: string;
    profile_photo?: string;
  }, ipAddress?: string, userAgent?: string): Promise<People> {
    const person = await this.findOne(personId);
    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    const updatedData = {
      ...profileData,
      profile_completed: true,
    };

    const updatedPerson = await this.update(personId, updatedData);

    // Log the activity
    await this.activityLogService.logProfileCompletion(
      personId,
      profileData,
      ipAddress,
      userAgent,
    );

    return updatedPerson;
  }
}
