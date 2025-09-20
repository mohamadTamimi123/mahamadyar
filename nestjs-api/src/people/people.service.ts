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
      relations: ['father', 'children', 'country', 'city', 'familyBranch'],
    });
  }

  async findOne(id: number): Promise<People | null> {
    return this.peopleRepository.findOne({
      where: { id },
      relations: ['father', 'children', 'country', 'city', 'familyBranch'],
    });
  }

  async create(peopleData: Partial<People>, ipAddress?: string, userAgent?: string): Promise<People> {
    // Generate unique registration code
    const registrationCode = await this.generateUniqueRegistrationCode();
    
    console.log('=== PEOPLE CREATE DEBUG ===');
    console.log('Received peopleData:', peopleData);
    console.log('country_id:', peopleData.country_id);
    console.log('city_id:', peopleData.city_id);
    
    const people = this.peopleRepository.create({
      ...peopleData,
      registration_code: registrationCode,
    });
    
    console.log('Created people object:', people);
    
    const savedPeople = await this.peopleRepository.save(people);
    
    console.log('Saved people:', savedPeople);
    console.log('=== END DEBUG ===');
    
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
    console.log('=== PEOPLE UPDATE DEBUG ===');
    console.log('Updating person ID:', id);
    console.log('Received peopleData:', peopleData);
    console.log('country_id:', peopleData.country_id);
    console.log('city_id:', peopleData.city_id);
    
    await this.peopleRepository.update(id, peopleData);
    
    console.log('Update completed, fetching updated person...');
    
    const updatedPeople = await this.findOne(id);
    if (!updatedPeople) {
      throw new NotFoundException(`People with ID ${id} not found`);
    }
    
    console.log('Updated people:', updatedPeople);
    console.log('=== END UPDATE DEBUG ===');
    
    return updatedPeople;
  }

  async remove(id: number): Promise<void> {
    await this.peopleRepository.delete(id);
  }

  // Get all people with their fathers
  async findAllWithFathers(): Promise<People[]> {
    return this.peopleRepository.find({
      relations: ['father', 'country', 'city', 'familyBranch'],
    });
  }

  // Get all people with their children
  async findAllWithChildren(): Promise<People[]> {
    return this.peopleRepository.find({
      relations: ['children', 'country', 'city', 'familyBranch'],
    });
  }

  // Get people by father_id
  async findByFatherId(fatherId: number): Promise<People[]> {
    return this.peopleRepository.find({
      where: { father_id: fatherId },
      relations: ['father', 'children', 'country', 'city', 'familyBranch'],
    });
  }

  // Get people without father (root level)
  async findRootPeople(): Promise<People[]> {
    return this.peopleRepository.find({
      where: { father_id: IsNull() },
      relations: ['children', 'country', 'city', 'familyBranch'],
    });
  }

  // Find person by registration code
  async findByRegistrationCode(registrationCode: string): Promise<People | null> {
    return this.peopleRepository.findOne({
      where: { registration_code: registrationCode },
      relations: ['father', 'children', 'country', 'city', 'familyBranch'],
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
      relations: ['father', 'spouse', 'children', 'country', 'city', 'familyBranch'],
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
    // Get all people with their relations - force fresh data
    const allPeople = await this.peopleRepository.find({
      relations: ['father', 'spouse', 'children', 'country', 'city', 'familyBranch'],
      cache: false, // Disable cache to get fresh data
    });

    console.log('=== FAMILY TREE DEBUG ===');
    console.log('All people from database:', allPeople.length);
    console.log('All people details:', allPeople.map(p => ({ 
      id: p.id, 
      name: p.name, 
      last_name: p.last_name,
      father_id: p.father_id, 
      spouse_id: p.spouse_id,
      has_father: !!p.father,
      has_spouse: !!p.spouse,
      children_count: p.children?.length || 0
    })));

    const person = allPeople.find(p => p.id === personId);
    if (!person) {
      throw new NotFoundException(`Person with ID ${personId} not found`);
    }

    console.log('Main person:', { 
      id: person.id, 
      name: person.name, 
      last_name: person.last_name,
      father_id: person.father_id, 
      spouse_id: person.spouse_id 
    });

    // Simple approach: Get all people who are connected to this person
    const familyMembers: People[] = [];
    const processedIds = new Set<number>();

    // Add the main person
    familyMembers.push(person);
    processedIds.add(person.id);

    // Add all people who share family connections
    for (const p of allPeople) {
      if (processedIds.has(p.id)) continue;

      // Check if this person is connected to our family tree
      let isConnected = false;

      // Check if this person is a family member of someone already in the tree
      for (const familyMember of familyMembers) {
        // Is this person the father of a family member?
        if (p.id === familyMember.father_id) {
          isConnected = true;
          break;
        }
        
        // Is this person the spouse of a family member?
        if (p.id === familyMember.spouse_id) {
          isConnected = true;
          break;
        }
        
        // Is this person a child of a family member?
        if (familyMember.children?.some(child => child.id === p.id)) {
          isConnected = true;
          break;
        }
        
        // Is this person's father in our family?
        if (p.father_id && familyMembers.some(fm => fm.id === p.father_id)) {
          isConnected = true;
          break;
        }
        
        // Is this person's spouse in our family?
        if (p.spouse_id && familyMembers.some(fm => fm.id === p.spouse_id)) {
          isConnected = true;
          break;
        }
      }

      if (isConnected) {
        familyMembers.push(p);
        processedIds.add(p.id);
        console.log(`Added connected person: ${p.name} ${p.last_name} (ID: ${p.id})`);
      }
    }

    console.log('=== FINAL RESULT ===');
    console.log('Final family members count:', familyMembers.length);
    console.log('Final family members:', familyMembers.map(f => ({ 
      id: f.id, 
      name: f.name, 
      last_name: f.last_name,
      father_id: f.father_id,
      spouse_id: f.spouse_id
    })));

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
