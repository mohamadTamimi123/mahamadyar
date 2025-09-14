import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLog, ActivityType } from './activity-log.entity';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get('person/:peopleId')
  async getActivityLogsByPersonId(
    @Param('peopleId', ParseIntPipe) peopleId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<ActivityLog[]> {
    return this.activityLogService.getActivityLogsByPersonId(
      peopleId,
      limit || 50,
      offset || 0,
    );
  }

  @Get('person/:peopleId/count')
  async getActivityLogsCount(
    @Param('peopleId', ParseIntPipe) peopleId: number,
  ): Promise<{ count: number }> {
    const count = await this.activityLogService.getActivityLogsCount(peopleId);
    return { count };
  }

  @Get('person/:peopleId/type/:activityType')
  async getActivityLogsByPersonIdAndType(
    @Param('peopleId', ParseIntPipe) peopleId: number,
    @Param('activityType') activityType: ActivityType,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<ActivityLog[]> {
    return this.activityLogService.getActivityLogsByPersonIdAndType(
      peopleId,
      activityType,
      limit || 50,
      offset || 0,
    );
  }

  @Post()
  async createActivityLog(
    @Body() data: {
      people_id: number;
      activity_type: ActivityType;
      description?: string;
      metadata?: any;
      ip_address?: string;
      user_agent?: string;
    },
  ): Promise<ActivityLog> {
    return this.activityLogService.createActivityLog(data);
  }

  @Delete(':id')
  async deleteActivityLog(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.activityLogService.deleteActivityLog(id);
  }

  @Delete('person/:peopleId')
  async deleteActivityLogsByPersonId(
    @Param('peopleId', ParseIntPipe) peopleId: number,
  ): Promise<void> {
    return this.activityLogService.deleteActivityLogsByPersonId(peopleId);
  }
}
