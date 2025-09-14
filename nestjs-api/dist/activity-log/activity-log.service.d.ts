import { Repository } from 'typeorm';
import { ActivityLog, ActivityType } from './activity-log.entity';
export declare class ActivityLogService {
    private activityLogRepository;
    constructor(activityLogRepository: Repository<ActivityLog>);
    createActivityLog(data: {
        people_id: number;
        activity_type: ActivityType;
        description?: string;
        metadata?: any;
        ip_address?: string;
        user_agent?: string;
    }): Promise<ActivityLog>;
    getActivityLogsByPersonId(peopleId: number, limit?: number, offset?: number): Promise<ActivityLog[]>;
    getActivityLogsByPersonIdAndType(peopleId: number, activityType: ActivityType, limit?: number, offset?: number): Promise<ActivityLog[]>;
    getActivityLogsCount(peopleId: number): Promise<number>;
    deleteActivityLog(id: number): Promise<void>;
    deleteActivityLogsByPersonId(peopleId: number): Promise<void>;
    logFamilyMemberAdded(peopleId: number, memberData: any, ipAddress?: string, userAgent?: string): Promise<ActivityLog>;
    logProfileCompletion(peopleId: number, profileData: any, ipAddress?: string, userAgent?: string): Promise<ActivityLog>;
    logPhotoUpload(peopleId: number, photoData: any, ipAddress?: string, userAgent?: string): Promise<ActivityLog>;
    logProfilePhotoSet(peopleId: number, photoId: number, ipAddress?: string, userAgent?: string): Promise<ActivityLog>;
}
