import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
export declare class NotificationsService {
    private repo;
    constructor(repo: Repository<Notification>);
    listByGroup(group_id: number): Promise<Notification[]>;
    create(data: Partial<Notification>): Promise<Notification>;
}
