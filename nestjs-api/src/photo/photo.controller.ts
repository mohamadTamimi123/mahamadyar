import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  UseGuards, 
  Request, 
  UseInterceptors, 
  UploadedFile,
  BadRequestException,
  Res
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService, CreatePhotoDto } from './photo.service';
import type { UpdatePhotoDto } from './photo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { description?: string; is_profile_picture?: string },
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('فایل انتخاب نشده است');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('نوع فایل پشتیبانی نمی‌شود');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('حجم فایل بیش از حد مجاز است (5MB)');
    }

    const uploadDir = await this.photoService.ensureUploadDir();
    const filename = this.photoService.generateUniqueFilename(file.originalname);
    const filePath = path.join(uploadDir, filename);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    const createPhotoDto: CreatePhotoDto = {
      filename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      file_path: filePath,
      description: body.description,
      is_profile_picture: body.is_profile_picture === 'true',
    };

    return this.photoService.create(createPhotoDto, req.user.id);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.photoService.findAllByUser(req.user.id);
  }

  @Get('profile')
  async getProfilePicture(@Request() req: any) {
    return this.photoService.getProfilePicture(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.photoService.findOne(+id, req.user.id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
    @Request() req: any,
  ) {
    return this.photoService.update(+id, updatePhotoDto, req.user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.photoService.remove(+id, req.user.id);
    return { message: 'عکس با موفقیت حذف شد' };
  }

  @Get('file/:id')
  async getPhotoFile(@Param('id') id: string, @Request() req: any, @Res() res: Response) {
    const photo = await this.photoService.findOne(+id, req.user.id);
    
    if (!fs.existsSync(photo.file_path)) {
      throw new BadRequestException('فایل یافت نشد');
    }

    res.setHeader('Content-Type', photo.mime_type);
    res.setHeader('Content-Disposition', `inline; filename="${photo.original_name}"`);
    
    const fileStream = fs.createReadStream(photo.file_path);
    fileStream.pipe(res);
  }
}

// Admin endpoints
@Controller('admin/photos')
@UseGuards(JwtAuthGuard)
export class AdminPhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get()
  async findAll() {
    return this.photoService.getAllPhotos();
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    return this.photoService.getPhotosByUser(+userId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhotoForUser(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { description?: string; is_profile_picture?: string; user_id: string },
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('فایل انتخاب نشده است');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('نوع فایل پشتیبانی نمی‌شود');
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('حجم فایل بیش از حد مجاز است (5MB)');
    }

    const uploadDir = await this.photoService.ensureUploadDir();
    const filename = this.photoService.generateUniqueFilename(file.originalname);
    const filePath = path.join(uploadDir, filename);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    const createPhotoDto: CreatePhotoDto = {
      filename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      file_path: filePath,
      description: body.description,
      is_profile_picture: body.is_profile_picture === 'true',
    };

    return this.photoService.create(createPhotoDto, +body.user_id);
  }
}
