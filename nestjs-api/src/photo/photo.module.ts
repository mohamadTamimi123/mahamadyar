import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoService } from './photo.service';
import { PhotoController, AdminPhotoController, PublicPhotoController } from './photo.controller';
import { Photo } from './photo.entity';
import { User } from '../user/user.entity';
import { People } from '../people/people.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, User, People])],
  providers: [PhotoService],
  controllers: [PhotoController, AdminPhotoController, PublicPhotoController],
  exports: [PhotoService],
})
export class PhotoModule {}
