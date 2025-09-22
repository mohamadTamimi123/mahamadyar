import { Group } from '../groups/group.entity';
import { User } from '../user/user.entity';
export declare class Notification {
    id: number;
    group_id: number | null;
    group: Group | null;
    type: string;
    title: string;
    body: string | null;
    metadata: any | null;
    requires_approval: boolean;
    is_approved: boolean;
    requested_by_user_id: number | null;
    requestedByUser: User;
    approved_by_user_id: number | null;
    approvedByUser: User;
    approval_notes: string | null;
    approved_at: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
