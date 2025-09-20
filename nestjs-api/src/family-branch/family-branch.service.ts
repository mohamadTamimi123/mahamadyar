import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { FamilyBranch } from './family-branch.entity';
import { People } from '../people/people.entity';

@Injectable()
export class FamilyBranchService {
  constructor(
    @InjectRepository(FamilyBranch)
    private familyBranchRepository: Repository<FamilyBranch>,
    @InjectRepository(People)
    private peopleRepository: Repository<People>,
  ) {}

  async create(createData: {
    name: string;
    description?: string;
    generation_level?: number;
    branch_color?: string;
    created_by_user_id: number;
    root_person_id?: number;
    parent_branch_id?: number;
  }): Promise<FamilyBranch> {
    const branch = this.familyBranchRepository.create(createData);
    return this.familyBranchRepository.save(branch);
  }

  async findAll(): Promise<FamilyBranch[]> {
    return this.familyBranchRepository.find({
      relations: ['createdByUser', 'rootPerson', 'parentBranch', 'subBranches', 'members'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByUser(userId: number): Promise<FamilyBranch[]> {
    return this.familyBranchRepository.find({
      where: { created_by_user_id: userId },
      relations: ['createdByUser', 'rootPerson', 'parentBranch', 'subBranches', 'members'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<FamilyBranch | null> {
    return this.familyBranchRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'rootPerson', 'parentBranch', 'subBranches', 'members']
    });
  }

  async update(id: number, updateData: Partial<FamilyBranch>): Promise<FamilyBranch | null> {
    await this.familyBranchRepository.update(id, updateData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.familyBranchRepository.delete(id);
  }

  async addMemberToBranch(branchId: number, personId: number): Promise<FamilyBranch | null> {
    const branch = await this.findOne(branchId);
    const person = await this.peopleRepository.findOne({ where: { id: personId } });

    if (!branch || !person) {
      return null;
    }

    person.family_branch_id = branchId;
    await this.peopleRepository.save(person);

    return this.findOne(branchId);
  }

  async removeMemberFromBranch(branchId: number, personId: number): Promise<FamilyBranch | null> {
    const person = await this.peopleRepository.findOne({ 
      where: { id: personId, family_branch_id: branchId } 
    });

    if (!person) {
      return null;
    }

    person.family_branch_id = null;
    await this.peopleRepository.save(person);

    return this.findOne(branchId);
  }

  async getBranchHierarchy(): Promise<FamilyBranch[]> {
    // Get all root branches (branches without parent)
    return this.familyBranchRepository.find({
      where: { parent_branch_id: IsNull() },
      relations: ['createdByUser', 'rootPerson', 'subBranches', 'members'],
      order: { generation_level: 'ASC', name: 'ASC' }
    });
  }

  async getBranchStats(): Promise<{
    totalBranches: number;
    activeBranches: number;
    totalMembers: number;
    averageMembersPerBranch: number;
  }> {
    const totalBranches = await this.familyBranchRepository.count();
    const activeBranches = await this.familyBranchRepository.count({ where: { is_active: true } });
    
    const branchesWithMembers = await this.familyBranchRepository
      .createQueryBuilder('branch')
      .leftJoin('branch.members', 'members')
      .select('branch.id')
      .addSelect('COUNT(members.id)', 'memberCount')
      .groupBy('branch.id')
      .getRawMany();

    const totalMembers = branchesWithMembers.reduce((sum, branch) => sum + parseInt(branch.memberCount), 0);
    const averageMembersPerBranch = branchesWithMembers.length > 0 ? totalMembers / branchesWithMembers.length : 0;

    return {
      totalBranches,
      activeBranches,
      totalMembers,
      averageMembersPerBranch: Math.round(averageMembersPerBranch * 100) / 100
    };
  }
}
