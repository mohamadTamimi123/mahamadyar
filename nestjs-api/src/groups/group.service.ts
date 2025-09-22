import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';
import { User } from '../user/user.entity';
import { Notification } from '../notifications/notification.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async findAll(): Promise<Group[]> {
    return this.groupRepository.find({
      relations: ['createdByUser', 'members', 'notifications'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Group | null> {
    return this.groupRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'members', 'notifications'],
    });
  }

  async findByUser(userId: number): Promise<Group[]> {
    return this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.createdByUser', 'createdByUser')
      .leftJoinAndSelect('group.members', 'members')
      .leftJoinAndSelect('group.notifications', 'notifications')
      .where('group.created_by_user_id = :userId', { userId })
      .orWhere('members.id = :userId', { userId })
      .orderBy('group.createdAt', 'DESC')
      .getMany();
  }

  async create(groupData: {
    name: string;
    description?: string;
    group_color?: string;
    is_private?: boolean;
    created_by_user_id: number;
  }): Promise<Group> {
    // Generate unique invite code for private groups
    let inviteCode: string | undefined;
    if (groupData.is_private) {
      inviteCode = await this.generateUniqueInviteCode();
    }

    const group = this.groupRepository.create({
      ...groupData,
      invite_code: inviteCode,
    });

    const savedGroup = await this.groupRepository.save(group);

    // Add creator as a member
    await this.addMember(savedGroup.id, groupData.created_by_user_id, groupData.created_by_user_id, 'admin');

    const result = await this.findOne(savedGroup.id);
    if (!result) {
      throw new Error('Failed to retrieve created group');
    }
    return result;
  }

  async update(id: number, groupData: Partial<Group>, userId: number): Promise<Group> {
    const group = await this.findOne(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    // Check if user is the creator
    if (group.created_by_user_id !== userId) {
      throw new ForbiddenException('Only the group creator can update the group');
    }

    await this.groupRepository.update(id, groupData);
    const result = await this.findOne(id);
    if (!result) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return result;
  }

  async delete(id: number, userId: number): Promise<void> {
    const group = await this.findOne(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    // Check if user is the creator
    if (group.created_by_user_id !== userId) {
      throw new ForbiddenException('Only the group creator can delete the group');
    }

    await this.groupRepository.delete(id);
  }

  async addMember(groupId: number, userId: number, requesterId: number, requesterRole: string): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['members'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check permissions: only group creator, branch managers, or admins can add members
    const isGroupCreator = group.created_by_user_id === requesterId;
    const isBranchManager = requesterRole === 'branch_manager';
    const isAdmin = requesterRole === 'admin';

    if (!isGroupCreator && !isBranchManager && !isAdmin) {
      throw new ForbiddenException('Only group creators, branch managers, or admins can add members');
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some(member => member.id === userId);
    if (isAlreadyMember) {
      const result = await this.findOne(groupId);
      if (!result) {
        throw new NotFoundException(`Group with ID ${groupId} not found`);
      }
      return result;
    }

    group.members.push(user);
    await this.groupRepository.save(group);

    const result = await this.findOne(groupId);
    if (!result) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    return result;
  }

  async removeMember(groupId: number, userId: number, requesterId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['members'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    // Check if requester is the creator or the member being removed
    if (group.created_by_user_id !== requesterId && userId !== requesterId) {
      throw new ForbiddenException('Only the group creator or the member themselves can remove members');
    }

    group.members = group.members.filter(member => member.id !== userId);
    await this.groupRepository.save(group);

    const result = await this.findOne(groupId);
    if (!result) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }
    return result;
  }

  async joinByInviteCode(inviteCode: string, userId: number): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { invite_code: inviteCode, is_private: true },
      relations: ['members'],
    });

    if (!group) {
      throw new NotFoundException('Invalid invite code');
    }

    return this.addMember(group.id, userId, userId, 'member');
  }

  async sendNotification(groupId: number, notificationData: {
    type: string;
    title: string;
    body?: string;
    metadata?: any;
  }, senderId: number): Promise<Notification> {
    const group = await this.findOne(groupId);
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    // Check if sender is a member of the group
    const isMember = group.members.some(member => member.id === senderId);
    if (!isMember && group.created_by_user_id !== senderId) {
      throw new ForbiddenException('Only group members can send notifications');
    }

    const notification = this.notificationRepository.create({
      ...notificationData,
      group_id: groupId,
    });

    return this.notificationRepository.save(notification);
  }

  async getGroupNotifications(groupId: number, userId: number): Promise<Notification[]> {
    const group = await this.findOne(groupId);
    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    // Check if user is a member of the group
    const isMember = group.members.some(member => member.id === userId);
    if (!isMember && group.created_by_user_id !== userId) {
      throw new ForbiddenException('Only group members can view notifications');
    }

    return this.notificationRepository.find({
      where: { group_id: groupId },
      order: { createdAt: 'DESC' }
    });
  }

  private async generateUniqueInviteCode(): Promise<string> {
    let code: string = '';
    let isUnique = false;
    
    while (!isUnique) {
      // Generate a 8-character code
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Check if code already exists
      const existingGroup = await this.groupRepository.findOne({
        where: { invite_code: code }
      });
      
      if (!existingGroup) {
        isUnique = true;
      }
    }
    
    return code;
  }
}
