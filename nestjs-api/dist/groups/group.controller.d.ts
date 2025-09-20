import { GroupService } from './group.service';
import { Group } from './group.entity';
export declare class GroupController {
    private readonly groupService;
    constructor(groupService: GroupService);
    findAll(): Promise<Group[]>;
    findMyGroups(req: any): Promise<Group[]>;
    findOne(id: number): Promise<Group>;
    create(groupData: {
        name: string;
        description?: string;
        group_color?: string;
        is_private?: boolean;
    }, req: any): Promise<Group>;
    update(id: number, groupData: Partial<Group>, req: any): Promise<Group>;
    remove(id: number, req: any): Promise<void>;
    addMember(groupId: number, body: {
        user_id: number;
    }, req: any): Promise<Group>;
    removeMember(groupId: number, userId: number, req: any): Promise<Group>;
    joinByInviteCode(body: {
        invite_code: string;
    }, req: any): Promise<Group>;
    sendNotification(groupId: number, notificationData: {
        type: string;
        title: string;
        body?: string;
        metadata?: any;
    }, req: any): Promise<import("../notifications/notification.entity").Notification>;
    getGroupNotifications(groupId: number, req: any): Promise<import("../notifications/notification.entity").Notification[]>;
}
