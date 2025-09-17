import { Group } from '../groups/group.entity';
export declare class Notification {
    id: number;
    group_id: number | null;
    group: Group | null;
    type: string;
    title: string;
    body: string | null;
    metadata: any | null;
    createdAt: Date;
    updatedAt: Date;
}
