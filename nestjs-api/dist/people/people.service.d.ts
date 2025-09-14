import { Repository } from 'typeorm';
import { People } from './people.entity';
export declare class PeopleService {
    private peopleRepository;
    constructor(peopleRepository: Repository<People>);
    findAll(): Promise<People[]>;
    findOne(id: number): Promise<People | null>;
    create(peopleData: Partial<People>): Promise<People>;
    private generateUniqueRegistrationCode;
    update(id: number, peopleData: Partial<People>): Promise<People>;
    remove(id: number): Promise<void>;
    findAllWithFathers(): Promise<People[]>;
    findAllWithChildren(): Promise<People[]>;
    findByFatherId(fatherId: number): Promise<People[]>;
    findRootPeople(): Promise<People[]>;
    findByRegistrationCode(registrationCode: string): Promise<People | null>;
    getImmediateFamily(personId: number): Promise<{
        person: People;
        father?: People;
        spouse?: People;
        children: People[];
    }>;
    getFamilyTree(personId: number): Promise<People[]>;
}
