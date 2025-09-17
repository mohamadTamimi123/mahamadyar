import { Notification } from '../notifications/notification.entity';
import { Event } from '../events/event.entity';
export declare class Group {
    id: number;
    country: string;
    city: string;
    name: string;
    leader_user_id: number | null;
    notifications: Notification[];
    events: Event[];
    createdAt: Date;
    updatedAt: Date;
}
