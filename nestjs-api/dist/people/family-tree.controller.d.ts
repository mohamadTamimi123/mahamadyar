import { FamilyTreeService, FamilyTreeNode } from './family-tree.service';
export declare class FamilyTreeController {
    private readonly familyTreeService;
    constructor(familyTreeService: FamilyTreeService);
    getAllFamilyTrees(): Promise<FamilyTreeNode[]>;
    getFamilyTreeForPerson(id: number): Promise<FamilyTreeNode | null>;
    getFamilyTreeStats(): Promise<{
        totalPeople: number;
        totalFamilies: number;
        averageChildrenPerFamily: number;
        completedProfiles: number;
    }>;
    searchInFamilyTree(searchTerm: string): Promise<FamilyTreeNode[]>;
}
