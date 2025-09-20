import { FamilyBranchService } from './family-branch.service';
import { FamilyBranch } from './family-branch.entity';
export declare class FamilyBranchController {
    private readonly familyBranchService;
    constructor(familyBranchService: FamilyBranchService);
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
    getHierarchy(): Promise<FamilyBranch[]>;
    getStats(): Promise<{
        totalBranches: number;
        activeBranches: number;
        totalMembers: number;
        averageMembersPerBranch: number;
    }>;
    findOne(id: number): Promise<FamilyBranch | null>;
    update(id: number, updateData: Partial<FamilyBranch>): Promise<FamilyBranch | null>;
    delete(id: number): Promise<{
        message: string;
    }>;
    addMember(branchId: number, personId: number): Promise<FamilyBranch | null>;
    removeMember(branchId: number, personId: number): Promise<FamilyBranch | null>;
}
