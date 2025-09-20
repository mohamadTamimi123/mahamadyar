import { GroupsService } from './groups.service';
export declare class GroupsController {
    private readonly groups;
    constructor(groups: GroupsService);
    myGroup(country: string, city: string): Promise<import("./group.entity").Group | null>;
    ensure(body: {
        country: string;
        city: string;
        leader_user_id?: number;
    }): Promise<import("./group.entity").Group | import("./group.entity").Group[]>;
}
