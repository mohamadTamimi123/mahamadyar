import { User } from '../user/user.entity';
import { People } from '../people/people.entity';
export declare class Photo {
    id: number;
    filename: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    file_path: string;
    description: string;
    is_profile_picture: boolean;
    is_active: boolean;
    user_id: number;
    people_id: number;
    user: User;
    people: People;
    created_at: Date;
    updated_at: Date;
}
