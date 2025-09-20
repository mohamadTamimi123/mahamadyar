import { NotificationsService } from './notifications.service';
import { GroupService } from '../groups/group.service';
export declare class NotificationsController {
    private readonly notifications;
    private readonly groups;
    constructor(notifications: NotificationsService, groups: GroupService);
    list(group_id?: number): Promise<import("./notification.entity").Notification[]>;
    create(body: {
        group_id?: number;
        type: string;
        title: string;
        body?: string;
        metadata?: any;
    }): Promise<import("./notification.entity").Notification>;
    createForMyGroup(req: any, body: {
        type: string;
        title: string;
        body?: string;
        metadata?: any;
        country?: string;
        city?: string;
    }): Promise<import("./notification.entity").Notification>;
}
