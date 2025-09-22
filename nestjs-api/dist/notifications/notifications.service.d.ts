import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
export declare class NotificationsService {
    private repo;
    constructor(repo: Repository<Notification>);
    listByGroup(group_id: number): Promise<Notification[]>;
    listApprovedByGroup(group_id: number): Promise<Notification[]>;
    create(data: Partial<Notification>): Promise<Notification>;
    getPendingApprovals(): Promise<Notification[]>;
    getUserGroupNotifications(userId: number): Promise<Notification[]>;
    approveNotification(notificationId: number, approverId: number, approved: boolean, notes?: string): Promise<Notification>;
}
