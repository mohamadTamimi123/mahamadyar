import { Group } from '../groups/group.entity';
export declare class Event {
    id: number;
    group_id: number | null;
    group: Group | null;
    type: string;
    title: string;
    date: Date;
    location: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
