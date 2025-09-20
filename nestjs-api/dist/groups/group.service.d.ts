import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { User } from '../user/user.entity';
import { Notification } from '../notifications/notification.entity';
export declare class GroupService {
    private groupRepository;
    private userRepository;
    private notificationRepository;
    constructor(groupRepository: Repository<Group>, userRepository: Repository<User>, notificationRepository: Repository<Notification>);
    findAll(): Promise<Group[]>;
    findOne(id: number): Promise<Group | null>;
    findByUser(userId: number): Promise<Group[]>;
    create(groupData: {
        name: string;
        description?: string;
        group_color?: string;
        is_private?: boolean;
        created_by_user_id: number;
    }): Promise<Group>;
    update(id: number, groupData: Partial<Group>, userId: number): Promise<Group>;
    delete(id: number, userId: number): Promise<void>;
    addMember(groupId: number, userId: number): Promise<Group>;
    removeMember(groupId: number, userId: number, requesterId: number): Promise<Group>;
    joinByInviteCode(inviteCode: string, userId: number): Promise<Group>;
    sendNotification(groupId: number, notificationData: {
        type: string;
        title: string;
        body?: string;
        metadata?: any;
    }, senderId: number): Promise<Notification>;
    getGroupNotifications(groupId: number, userId: number): Promise<Notification[]>;
    private generateUniqueInviteCode;
}
