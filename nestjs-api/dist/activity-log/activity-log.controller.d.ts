import { ActivityLogService } from './activity-log.service';
import { ActivityLog, ActivityType } from './activity-log.entity';
export declare class ActivityLogController {
    private readonly activityLogService;
    constructor(activityLogService: ActivityLogService);
    getActivityLogsByPersonId(peopleId: number, limit?: number, offset?: number): Promise<ActivityLog[]>;
    getActivityLogsCount(peopleId: number): Promise<{
        count: number;
    }>;
    getActivityLogsByPersonIdAndType(peopleId: number, activityType: ActivityType, limit?: number, offset?: number): Promise<ActivityLog[]>;
    createActivityLog(data: {
        people_id: number;
        activity_type: ActivityType;
        description?: string;
        metadata?: any;
        ip_address?: string;
        user_agent?: string;
    }): Promise<ActivityLog>;
    deleteActivityLog(id: number): Promise<void>;
    deleteActivityLogsByPersonId(peopleId: number): Promise<void>;
}
