import { Photo } from '../photo/photo.entity';
import { FamilyBranch } from '../family-branch/family-branch.entity';
export declare class People {
    id: number;
    name: string;
    last_name: string;
    registration_code: string;
    father_id: number;
    spouse_id: number;
    birth_date: Date;
    birth_place: string;
    job: string;
    current_location: string;
    profile_photo: string;
    profile_completed: boolean;
    family_branch_id: number;
    father: People;
    children: People[];
    spouse: People;
    spouseOf: People[];
    photos: Photo[];
    familyBranch: FamilyBranch;
    createdAt: Date;
    updatedAt: Date;
}
