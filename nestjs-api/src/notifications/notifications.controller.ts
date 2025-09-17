import { Controller, Get, Post, Body, Query, UseGuards, ForbiddenException, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { GroupsService } from '../groups/groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notifications: NotificationsService,
    private readonly groups: GroupsService,
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

    // Derive group from provided country/city or fallback to user profile if later available
    const country = body.country || 'IR';
    const city = body.city || 'Tehran';
    const group = await this.groups.findOrCreate(country, city, user.role === 'branch_manager' ? user.id : null);

    // If branch_manager, enforce ownership of the group
    if (user.role === 'branch_manager' && group.leader_user_id && group.leader_user_id !== user.id) {
      throw new ForbiddenException('You are not the leader of this group');
    }

    return this.notifications.create({
      group_id: group.id,
      type: body.type,
      title: body.title,
      body: body.body ?? null,
      metadata: body.metadata ?? null,
    });
  }
}


