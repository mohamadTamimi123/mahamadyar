import { PeopleService } from './people.service';
import { People } from './people.entity';
export declare class PeopleController {
    private readonly peopleService;
    constructor(peopleService: PeopleService);
    findAll(withParam?: string): Promise<People[]>;
    findOne(id: number): Promise<People>;
    findByFatherId(fatherId: number): Promise<People[]>;
    findByRegistrationCode(registrationCode: string): Promise<People>;
    getImmediateFamily(id: number): Promise<{
        person: People;
        father?: People;
        spouse?: People;
        children: People[];
    }>;
    getFamilyTree(id: number): Promise<People[]>;
    create(peopleData: Partial<People>): Promise<People>;
    update(id: number, peopleData: Partial<People>): Promise<People>;
    remove(id: number): Promise<void>;
    completeProfile(id: number, profileData: {
        birth_date?: string;
        birth_place?: string;
        job?: string;
        current_location?: string;
        profile_photo?: string;
    }): Promise<People>;
}
