import { User } from '../user/user.entity';
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
    user: User;
    created_at: Date;
    updated_at: Date;
}
