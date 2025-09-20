import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { People } from './people.entity';

export interface FamilyTreeNode {
  id: number;
  name: string;
  last_name?: string;
  birth_date?: Date;
  birth_place?: string;
  job?: string;
  current_location?: string;
  profile_photo?: string;
  profile_completed: boolean;
  children: FamilyTreeNode[];
  spouse?: FamilyTreeNode;
  father?: FamilyTreeNode;
}

@Injectable()
export class FamilyTreeService {
  constructor(
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
  ) {}

  async createFamilyTreeForPerson(personId: number): Promise<FamilyTreeNode | null> {
    const person = await this.peopleRepository.findOne({
      where: { id: personId },
      relations: ['father', 'spouse', 'children', 'photos']
    });

    if (!person) {
      return null;
    }

    return this.buildFamilyTreeNode(person);
  }

  async createFamilyTreeForAllPeople(): Promise<FamilyTreeNode[]> {
    // Get all root people (people without fathers)
    const rootPeople = await this.peopleRepository.find({
      where: { father_id: IsNull() },
      relations: ['father', 'spouse', 'children', 'photos']
    });

    return Promise.all(
      rootPeople.map(person => this.buildFamilyTreeNode(person))
    );
  }

  private async buildFamilyTreeNode(person: People): Promise<FamilyTreeNode> {
    const node: FamilyTreeNode = {
      id: person.id,
      name: person.name,
      last_name: person.last_name,
      birth_date: person.birth_date,
      birth_place: person.birth_place,
      job: person.job,
      current_location: person.current_location,
      profile_photo: person.profile_photo,
      profile_completed: person.profile_completed,
      children: [],
      spouse: undefined,
      father: undefined
    };

    // Add spouse if exists
    if (person.spouse) {
      node.spouse = {
        id: person.spouse.id,
        name: person.spouse.name,
        last_name: person.spouse.last_name,
        birth_date: person.spouse.birth_date,
        birth_place: person.spouse.birth_place,
        job: person.spouse.job,
        current_location: person.spouse.current_location,
        profile_photo: person.spouse.profile_photo,
        profile_completed: person.spouse.profile_completed,
        children: [],
        spouse: undefined,
        father: undefined
      };
    }

    // Add father if exists
    if (person.father) {
      node.father = {
        id: person.father.id,
        name: person.father.name,
        last_name: person.father.last_name,
        birth_date: person.father.birth_date,
        birth_place: person.father.birth_place,
        job: person.father.job,
        current_location: person.father.current_location,
        profile_photo: person.father.profile_photo,
        profile_completed: person.father.profile_completed,
        children: [],
        spouse: undefined,
        father: undefined
      };
    }

    // Recursively add children
    if (person.children && person.children.length > 0) {
      node.children = await Promise.all(
        person.children.map(child => this.buildFamilyTreeNode(child))
      );
    }

    return node;
  }

  async getFamilyTreeStats(): Promise<{
    totalPeople: number;
    totalFamilies: number;
    averageChildrenPerFamily: number;
    completedProfiles: number;
  }> {
    const totalPeople = await this.peopleRepository.count();
    const rootPeople = await this.peopleRepository.count({ where: { father_id: IsNull() } });
    const completedProfiles = await this.peopleRepository.count({ where: { profile_completed: true } });
    
    // Calculate average children per family
    const familiesWithChildren = await this.peopleRepository
      .createQueryBuilder('person')
      .leftJoin('person.children', 'children')
      .select('person.id')
      .addSelect('COUNT(children.id)', 'childrenCount')
      .where('person.father_id IS NULL')
      .groupBy('person.id')
      .having('COUNT(children.id) > 0')
      .getRawMany();

    const totalChildren = familiesWithChildren.reduce((sum, family) => sum + parseInt(family.childrenCount), 0);
    const averageChildrenPerFamily = familiesWithChildren.length > 0 ? totalChildren / familiesWithChildren.length : 0;

    return {
      totalPeople,
      totalFamilies: rootPeople,
      averageChildrenPerFamily: Math.round(averageChildrenPerFamily * 100) / 100,
      completedProfiles
    };
  }

  async searchInFamilyTree(searchTerm: string): Promise<FamilyTreeNode[]> {
    const people = await this.peopleRepository
      .createQueryBuilder('person')
      .leftJoinAndSelect('person.father', 'father')
      .leftJoinAndSelect('person.spouse', 'spouse')
      .leftJoinAndSelect('person.children', 'children')
      .leftJoinAndSelect('person.photos', 'photos')
      .where('person.name ILIKE :search OR person.last_name ILIKE :search OR person.job ILIKE :search OR person.current_location ILIKE :search', {
        search: `%${searchTerm}%`
      })
      .getMany();

    return Promise.all(people.map(person => this.buildFamilyTreeNode(person)));
  }
}
