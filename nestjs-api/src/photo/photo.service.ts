import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { User } from '../user/user.entity';
import * as fs from 'fs';
import * as path from 'path';

export interface CreatePhotoDto {
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  file_path: string;
  description?: string;
  is_profile_picture?: boolean;
  people_id?: number;
}

export interface UpdatePhotoDto {
  description?: string;
  is_profile_picture?: boolean;
  is_active?: boolean;
}

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto, userId: number, peopleId?: number): Promise<Photo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    // If this is a profile picture, deactivate other profile pictures
    if (createPhotoDto.is_profile_picture) {
      await this.photoRepository.update(
        { user_id: userId, is_profile_picture: true },
        { is_profile_picture: false }
      );
    }

    const photo = this.photoRepository.create({
      ...createPhotoDto,
      user_id: userId,
      people_id: peopleId,
    });

    return this.photoRepository.save(photo);
  }

  async findAllByUser(userId: number): Promise<Photo[]> {
    return this.photoRepository.find({
      where: { user_id: userId, is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number, userId: number): Promise<Photo> {
    const photo = await this.photoRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!photo) {
      throw new NotFoundException('عکس یافت نشد');
    }

    return photo;
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto, userId: number): Promise<Photo> {
    const photo = await this.findOne(id, userId);

    // If setting as profile picture, deactivate others
    if (updatePhotoDto.is_profile_picture) {
      await this.photoRepository.update(
        { user_id: userId, is_profile_picture: true },
        { is_profile_picture: false }
      );
    }

    Object.assign(photo, updatePhotoDto);
    return this.photoRepository.save(photo);
  }

  async remove(id: number, userId: number): Promise<void> {
    const photo = await this.findOne(id, userId);
    
    // Delete file from filesystem
    try {
      if (fs.existsSync(photo.file_path)) {
        fs.unlinkSync(photo.file_path);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await this.photoRepository.remove(photo);
  }

  async getProfilePicture(userId: number): Promise<Photo | null> {
    return this.photoRepository.findOne({
      where: { user_id: userId, is_profile_picture: true, is_active: true },
    });
  }

  async getAllPhotos(): Promise<Photo[]> {
    return this.photoRepository.find({
      relations: ['user'],
      order: { created_at: 'DESC' },
    });
  }

  async getPhotosByUser(userId: number): Promise<Photo[]> {
    return this.photoRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async getPhotosByPeople(peopleId: number): Promise<Photo[]> {
    return this.photoRepository.find({
      where: { people_id: peopleId, is_active: true },
      order: { created_at: 'DESC' },
    });
  }

  async createForPeople(createPhotoDto: CreatePhotoDto, userId: number, peopleId: number): Promise<Photo> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('کاربر یافت نشد');
    }

    // If this is a profile picture, deactivate other profile pictures for this person
    if (createPhotoDto.is_profile_picture) {
      await this.photoRepository.update(
        { people_id: peopleId, is_profile_picture: true },
        { is_profile_picture: false }
      );
    }

    const photo = this.photoRepository.create({
      ...createPhotoDto,
      user_id: userId,
      people_id: peopleId,
    });

    return this.photoRepository.save(photo);
  }

  async findPublicPhoto(id: number): Promise<Photo | null> {
    return this.photoRepository.findOne({
      where: { id, is_active: true },
      relations: ['user'],
    });
  }

  // Helper method to ensure upload directory exists
  async ensureUploadDir(): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', 'photos');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    return uploadDir;
  }

  // Helper method to generate unique filename
  generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(originalName);
    return `${timestamp}_${randomString}${extension}`;
  }
}
