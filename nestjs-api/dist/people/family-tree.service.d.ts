import { Repository } from 'typeorm';
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
export declare class FamilyTreeService {
    private peopleRepository;
    constructor(peopleRepository: Repository<People>);
    createFamilyTreeForPerson(personId: number): Promise<FamilyTreeNode | null>;
    createFamilyTreeForAllPeople(): Promise<FamilyTreeNode[]>;
    private buildFamilyTreeNode;
    getFamilyTreeStats(): Promise<{
        totalPeople: number;
        totalFamilies: number;
        averageChildrenPerFamily: number;
        completedProfiles: number;
    }>;
    searchInFamilyTree(searchTerm: string): Promise<FamilyTreeNode[]>;
}
