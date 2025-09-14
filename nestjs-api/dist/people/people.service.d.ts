import { Repository } from 'typeorm';
import { People } from './people.entity';
import { ActivityLogService } from '../activity-log/activity-log.service';
export declare class PeopleService {
    private peopleRepository;
    private activityLogService;
    constructor(peopleRepository: Repository<People>, activityLogService: ActivityLogService);
    findAll(): Promise<People[]>;
    findOne(id: number): Promise<People | null>;
    create(peopleData: Partial<People>, ipAddress?: string, userAgent?: string): Promise<People>;
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
    completeProfile(personId: number, profileData: {
        birth_date?: Date;
        birth_place?: string;
        job?: string;
        current_location?: string;
        profile_photo?: string;
    }, ipAddress?: string, userAgent?: string): Promise<People>;
}
