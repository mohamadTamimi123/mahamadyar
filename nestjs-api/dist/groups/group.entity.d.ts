import { User } from '../user/user.entity';
import { Notification } from '../notifications/notification.entity';
import { Event } from '../events/event.entity';
export declare class Group {
    id: number;
    name: string;
    description: string;
    group_color: string;
    is_active: boolean;
    created_by_user_id: number;
    group_image: string;
    is_private: boolean;
    invite_code: string;
    createdByUser: User;
    members: User[];
    notifications: Notification[];
    events: Event[];
    createdAt: Date;
    updatedAt: Date;
}
