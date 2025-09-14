import { People } from '../people/people.entity';
import { Photo } from '../photo/photo.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    password: string;
    phone: string;
    people_id: number;
    people: People;
    photos: Photo[];
    createdAt: Date;
    updatedAt: Date;
}
