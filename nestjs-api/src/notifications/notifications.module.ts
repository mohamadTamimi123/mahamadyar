import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { GroupModule } from '../groups/group.module';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]), GroupModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}


