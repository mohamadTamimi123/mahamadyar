import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, NotFoundException, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { GroupService } from './group.service';
import { Group } from './group.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('groups')
@UseGuards(JwtAuthGuard)
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async findAll(): Promise<Group[]> {
    return this.groupService.findAll();
  }

  @Get('my')
  async findMyGroups(@Request() req): Promise<Group[]> {
    const userId = req.user.id;
    return this.groupService.findByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Group> {
    const group = await this.groupService.findOne(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  @Post()
  async create(@Body() groupData: {
    name: string;
    description?: string;
    group_color?: string;
    is_private?: boolean;
  }, @Request() req): Promise<Group> {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    // Only branch managers can create groups
    if (userRole !== 'branch_manager') {
      throw new ForbiddenException('Only branch managers can create groups');
    }
    
    return this.groupService.create({
      ...groupData,
      created_by_user_id: userId,
    });
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() groupData: Partial<Group>,
    @Request() req,
  ): Promise<Group> {
    const userId = req.user.id;
    return this.groupService.update(id, groupData, userId);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    const userId = req.user.id;
    return this.groupService.delete(id, userId);
  }

  @Post(':id/members')
  async addMember(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() body: { user_id: number },
    @Request() req,
  ): Promise<Group> {
    const requesterId = req.user.id;
    const requesterRole = req.user.role;
    return this.groupService.addMember(groupId, body.user_id, requesterId, requesterRole);
  }

  @Delete(':id/members/:userId')
  async removeMember(
    @Param('id', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ): Promise<Group> {
    const requesterId = req.user.id;
    return this.groupService.removeMember(groupId, userId, requesterId);
  }

  @Post('join')
  async joinByInviteCode(
    @Body() body: { invite_code: string },
    @Request() req,
  ): Promise<Group> {
    const userId = req.user.id;
    return this.groupService.joinByInviteCode(body.invite_code, userId);
  }

  @Post(':id/notifications')
  async sendNotification(
    @Param('id', ParseIntPipe) groupId: number,
    @Body() notificationData: {
      type: string;
      title: string;
      body?: string;
      metadata?: any;
    },
    @Request() req,
  ) {
    const senderId = req.user.id;
    return this.groupService.sendNotification(groupId, notificationData, senderId);
  }

  @Get(':id/notifications')
  async getGroupNotifications(
    @Param('id', ParseIntPipe) groupId: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.groupService.getGroupNotifications(groupId, userId);
  }
}
