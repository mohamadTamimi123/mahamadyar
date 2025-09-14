import { PhotoService } from './photo.service';
import type { UpdatePhotoDto } from './photo.service';
import type { Response } from 'express';
export declare class PhotoController {
    private readonly photoService;
    constructor(photoService: PhotoService);
    uploadPhoto(file: Express.Multer.File, body: {
        description?: string;
        is_profile_picture?: string;
    }, req: any): Promise<import("./photo.entity").Photo>;
    findAll(req: any): Promise<import("./photo.entity").Photo[]>;
    getProfilePicture(req: any): Promise<import("./photo.entity").Photo | null>;
    findOne(id: string, req: any): Promise<import("./photo.entity").Photo>;
    update(id: string, updatePhotoDto: UpdatePhotoDto, req: any): Promise<import("./photo.entity").Photo>;
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
    getPhotoFile(id: string, req: any, res: Response): Promise<void>;
}
export declare class AdminPhotoController {
    private readonly photoService;
    constructor(photoService: PhotoService);
    findAll(): Promise<import("./photo.entity").Photo[]>;
    findByUser(userId: string): Promise<import("./photo.entity").Photo[]>;
}
