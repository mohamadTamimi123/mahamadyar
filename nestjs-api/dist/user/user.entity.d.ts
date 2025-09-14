import { People } from '../people/people.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    password: string;
    phone: string;
    people_id: number;
    people: People;
    createdAt: Date;
    updatedAt: Date;
}
