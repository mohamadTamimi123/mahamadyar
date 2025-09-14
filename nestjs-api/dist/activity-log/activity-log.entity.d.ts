import { People } from '../people/people.entity';
export declare enum ActivityType {
    PROFILE_CREATED = "profile_created",
    PROFILE_UPDATED = "profile_updated",
    PROFILE_COMPLETED = "profile_completed",
    FAMILY_MEMBER_ADDED = "family_member_added",
    PHOTO_UPLOADED = "photo_uploaded",
    PHOTO_DELETED = "photo_deleted",
    PROFILE_PHOTO_SET = "profile_photo_set"
}
export declare class ActivityLog {
    id: number;
    people_id: number;
    activity_type: ActivityType;
    description: string;
    metadata: any;
    ip_address: string;
    user_agent: string;
    people: People;
    created_at: Date;
}
