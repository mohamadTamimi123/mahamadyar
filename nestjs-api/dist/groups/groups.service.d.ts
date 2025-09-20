import { Repository } from 'typeorm';
import { Group } from './group.entity';
export declare class GroupsService {
    private repo;
    constructor(repo: Repository<Group>);
    findOrCreate(country: string, city: string, leader_user_id?: number | null): Promise<Group | Group[]>;
    findMyGroup(country: string, city: string): Promise<Group | null>;
}
