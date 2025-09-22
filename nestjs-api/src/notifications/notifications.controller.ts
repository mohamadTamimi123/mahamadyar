import { Controller, Get, Post, Body, Query, UseGuards, ForbiddenException, Request, Put, Param, ParseIntPipe } from '@nestjs/common';
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
      return this.notifications.listApprovedByGroup(+group_id);
    }
    return [];
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: any,
    @Body()
    body: { group_id?: number; type: string; title: string; body?: string; metadata?: any },
  ) {
    const user = req.user as { id: number; role?: string };

    // Only admins and branch managers can create notifications directly
    if (!(user.role === 'admin' || user.role === 'branch_manager')) {
      throw new ForbiddenException('Only admins and branch managers can create notifications directly. Regular users should use request-approval endpoint.');
    }

    return this.notifications.create({
      group_id: body.group_id ?? null,
      type: body.type,
      title: body.title,
      body: body.body ?? null,
      metadata: body.metadata ?? null,
      requires_approval: false,
      is_approved: true,
      requested_by_user_id: user.id,
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
      requires_approval: false,
      is_approved: true,
      requested_by_user_id: user.id,
    });
  }

  // Request notification approval (for regular users)
  @UseGuards(JwtAuthGuard)
  @Post('request-approval')
  async requestNotificationApproval(
    @Request() req: any,
    @Body()
    body: { group_id: number; type: string; title: string; body?: string; metadata?: any },
  ) {
    const user = req.user as { id: number; role?: string };

    // Check if user is a regular user (not admin or branch_manager)
    if (user.role === 'admin' || user.role === 'branch_manager') {
      throw new ForbiddenException('Admins and branch managers do not need approval');
    }

    // Check if user is a member of the group
    const group = await this.groups.findOne(body.group_id);
    if (!group) {
      throw new ForbiddenException('Group not found');
    }

    const isMember = group.members.some(member => member.id === user.id);
    if (!isMember && group.created_by_user_id !== user.id) {
      throw new ForbiddenException('You are not a member of this group');
    }

    return this.notifications.create({
      group_id: body.group_id,
      type: body.type,
      title: body.title,
      body: body.body ?? null,
      metadata: body.metadata ?? null,
      requires_approval: true,
      is_approved: false,
      requested_by_user_id: user.id,
    });
  }

  // Get pending approval requests (for branch managers and admins)
  @UseGuards(JwtAuthGuard)
  @Get('pending-approvals')
  async getPendingApprovals(@Request() req: any) {
    const user = req.user as { id: number; role?: string };

    if (!(user.role === 'branch_manager' || user.role === 'admin')) {
      throw new ForbiddenException('Only branch managers and admins can view pending approvals');
    }

    return this.notifications.getPendingApprovals();
  }

  // Get user's group notifications (for regular users)
  @UseGuards(JwtAuthGuard)
  @Get('my-group')
  async getMyGroupNotifications(@Request() req: any) {
    const user = req.user as { id: number; role?: string };
    
    // Get user's group notifications
    return this.notifications.getUserGroupNotifications(user.id);
  }

  // Approve or reject notification
  @UseGuards(JwtAuthGuard)
  @Put(':id/approve')
  async approveNotification(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() body: { approved: boolean; notes?: string },
  ) {
    const user = req.user as { id: number; role?: string };

    if (!(user.role === 'branch_manager' || user.role === 'admin')) {
      throw new ForbiddenException('Only branch managers and admins can approve notifications');
    }

    return this.notifications.approveNotification(id, user.id, body.approved, body.notes);
  }
}


