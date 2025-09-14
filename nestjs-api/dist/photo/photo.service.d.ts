import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { User } from '../user/user.entity';
export interface CreatePhotoDto {
    filename: string;
    original_name: string;
    mime_type: string;
    file_size: number;
    file_path: string;
    description?: string;
    is_profile_picture?: boolean;
}
export interface UpdatePhotoDto {
    description?: string;
    is_profile_picture?: boolean;
    is_active?: boolean;
}
export declare class PhotoService {
    private photoRepository;
    private userRepository;
    constructor(photoRepository: Repository<Photo>, userRepository: Repository<User>);
    create(createPhotoDto: CreatePhotoDto, userId: number): Promise<Photo>;
    findAllByUser(userId: number): Promise<Photo[]>;
    findOne(id: number, userId: number): Promise<Photo>;
    update(id: number, updatePhotoDto: UpdatePhotoDto, userId: number): Promise<Photo>;
    remove(id: number, userId: number): Promise<void>;
    getProfilePicture(userId: number): Promise<Photo | null>;
    getAllPhotos(): Promise<Photo[]>;
    getPhotosByUser(userId: number): Promise<Photo[]>;
    findPublicPhoto(id: number): Promise<Photo | null>;
    ensureUploadDir(): Promise<string>;
    generateUniqueFilename(originalName: string): string;
}
