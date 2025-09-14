import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActivityType } from './activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async createActivityLog(data: {
    people_id: number;
    activity_type: ActivityType;
    description?: string;
    metadata?: any;
    ip_address?: string;
    user_agent?: string;
  }): Promise<ActivityLog> {
    const activityLog = this.activityLogRepository.create(data);
    return this.activityLogRepository.save(activityLog);
  }

  async getActivityLogsByPersonId(
    peopleId: number,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { people_id: peopleId },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getActivityLogsByPersonIdAndType(
    peopleId: number,
    activityType: ActivityType,
    limit: number = 50,
    offset: number = 0,
  ): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { 
        people_id: peopleId,
        activity_type: activityType,
      },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getActivityLogsCount(peopleId: number): Promise<number> {
    return this.activityLogRepository.count({
      where: { people_id: peopleId },
    });
  }

  async deleteActivityLog(id: number): Promise<void> {
    await this.activityLogRepository.delete(id);
  }

  async deleteActivityLogsByPersonId(peopleId: number): Promise<void> {
    await this.activityLogRepository.delete({ people_id: peopleId });
  }

  // Helper method to log profile completion
  async logProfileCompletion(
    peopleId: number,
    profileData: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLog> {
    return this.createActivityLog({
      people_id: peopleId,
      activity_type: ActivityType.PROFILE_COMPLETED,
      description: 'پروفایل کاربری تکمیل شد',
      metadata: {
        fields_completed: Object.keys(profileData).filter(key => profileData[key]),
        completion_data: profileData,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  }

  // Helper method to log photo upload
  async logPhotoUpload(
    peopleId: number,
    photoData: any,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLog> {
    return this.createActivityLog({
      people_id: peopleId,
      activity_type: ActivityType.PHOTO_UPLOADED,
      description: 'عکس جدید آپلود شد',
      metadata: {
        photo_id: photoData.id,
        filename: photoData.filename,
        original_name: photoData.original_name,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  }

  // Helper method to log profile photo setting
  async logProfilePhotoSet(
    peopleId: number,
    photoId: number,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLog> {
    return this.createActivityLog({
      people_id: peopleId,
      activity_type: ActivityType.PROFILE_PHOTO_SET,
      description: 'عکس پروفایل تنظیم شد',
      metadata: {
        photo_id: photoId,
      },
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  }
}
