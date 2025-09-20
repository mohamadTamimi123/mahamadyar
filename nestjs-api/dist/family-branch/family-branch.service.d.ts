import { Repository } from 'typeorm';
import { FamilyBranch } from './family-branch.entity';
import { People } from '../people/people.entity';
export declare class FamilyBranchService {
    private familyBranchRepository;
    private peopleRepository;
    constructor(familyBranchRepository: Repository<FamilyBranch>, peopleRepository: Repository<People>);
    create(createData: {
        name: string;
        description?: string;
        generation_level?: number;
        branch_color?: string;
        created_by_user_id: number;
        root_person_id?: number;
        parent_branch_id?: number;
    }): Promise<FamilyBranch>;
    findAll(): Promise<FamilyBranch[]>;
    findByUser(userId: number): Promise<FamilyBranch[]>;
    findOne(id: number): Promise<FamilyBranch | null>;
    update(id: number, updateData: Partial<FamilyBranch>): Promise<FamilyBranch | null>;
    delete(id: number): Promise<void>;
    addMemberToBranch(branchId: number, personId: number): Promise<FamilyBranch | null>;
    removeMemberFromBranch(branchId: number, personId: number): Promise<FamilyBranch | null>;
    getBranchHierarchy(): Promise<FamilyBranch[]>;
    getBranchStats(): Promise<{
        totalBranches: number;
        activeBranches: number;
        totalMembers: number;
        averageMembersPerBranch: number;
    }>;
}
