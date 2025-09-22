import { NotificationsService } from './notifications.service';
import { GroupService } from '../groups/group.service';
export declare class NotificationsController {
    private readonly notifications;
    private readonly groups;
    constructor(notifications: NotificationsService, groups: GroupService);
    list(group_id?: number): Promise<import("./notification.entity").Notification[]>;
    create(req: any, body: {
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
    requestNotificationApproval(req: any, body: {
        group_id: number;
        type: string;
        title: string;
        body?: string;
        metadata?: any;
    }): Promise<import("./notification.entity").Notification>;
    getPendingApprovals(req: any): Promise<import("./notification.entity").Notification[]>;
    getMyGroupNotifications(req: any): Promise<import("./notification.entity").Notification[]>;
    approveNotification(id: number, req: any, body: {
        approved: boolean;
        notes?: string;
    }): Promise<import("./notification.entity").Notification>;
}
