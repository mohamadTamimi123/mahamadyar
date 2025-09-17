import { EventsService } from './events.service';
export declare class EventsController {
    private readonly events;
    constructor(events: EventsService);
    list(group_id?: number): Promise<import("./event.entity").Event[]>;
    create(body: {
        group_id?: number;
        type: string;
        title: string;
        date: string;
        location?: string;
        description?: string;
    }): Promise<import("./event.entity").Event>;
}
