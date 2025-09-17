import { Repository } from 'typeorm';
import { Event } from './event.entity';
export declare class EventsService {
    private repo;
    constructor(repo: Repository<Event>);
    list(group_id?: number): Promise<Event[]>;
    create(data: Partial<Event>): Promise<Event>;
}
