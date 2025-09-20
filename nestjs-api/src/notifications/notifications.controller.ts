import { Controller, Get, Post, Body, Query, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { GroupService } from '../groups/group.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly groups: GroupService,
  ) {}

  @Get()
  async list(@Query('group_id') group_id?: number) {
    if (group_id) {
      return this.notifications.listByGroup(+group_id);
    }
    return [];
  }

  @Post()
  async create(
    @Body()
    body: { group_id?: number; type: string; title: string; body?: string; metadata?: any },
  ) {
    return this.notifications.create({
      group_id: body.group_id ?? null,
      type: body.type,
      title: body.title,
      body: body.body ?? null,
      metadata: body.metadata ?? null,
    });
  }

  // Send notification to the caller's own group
  @UseGuards(JwtAuthGuard)
  @Post('my')
  async createForMyGroup(
    @Request() req: any,
    @Body()
    body: { type: string; title: string; body?: string; metadata?: any; country?: string; city?: string },
  ) {
    const user = req.user as { id: number; role?: string; people?: any; people_id?: number };

    if (!(user.role === 'branch_manager' || user.role === 'admin')) {
      throw new ForbiddenException('Only group leaders or admins can send notifications');
    }

    // For now, create notification without group association
    // This can be updated later to work with the new group system
    return this.notifications.create({
      group_id: null,
      type: body.type,
      title: body.title,
      body: body.body ?? null,
      metadata: body.metadata ?? null,
    });
  }
}


