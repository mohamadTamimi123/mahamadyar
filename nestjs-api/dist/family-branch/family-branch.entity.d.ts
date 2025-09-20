import { User } from '../user/user.entity';
import { People } from '../people/people.entity';
export declare class FamilyBranch {
    id: number;
    name: string;
    description: string;
    generation_level: number;
    branch_color: string;
    is_active: boolean;
    created_by_user_id: number;
    root_person_id: number;
    parent_branch_id: number;
    createdByUser: User;
    rootPerson: People;
    parentBranch: FamilyBranch;
    subBranches: FamilyBranch[];
    members: People[];
    createdAt: Date;
    updatedAt: Date;
}
