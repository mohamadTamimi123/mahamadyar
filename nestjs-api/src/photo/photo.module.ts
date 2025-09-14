import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service';
import { PhotoController, AdminPhotoController, PublicPhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, User])],
  providers: [PhotoService],
  controllers: [PhotoController, AdminPhotoController, PublicPhotoController],
  exports: [PhotoService],
})
export class PhotoModule {}
