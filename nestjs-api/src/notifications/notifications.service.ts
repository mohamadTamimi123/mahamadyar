import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private repo: Repository<Notification>,
  ) {}

  async listByGroup(group_id: number) {
    return this.repo.find({ 
      where: { group_id }, 
      relations: ['requestedByUser', 'approvedByUser'],
      order: { createdAt: 'DESC' } 
    });
  }

  async listApprovedByGroup(group_id: number) {
    return this.repo.find({ 
      where: { 
        group_id,
        is_approved: true
      }, 
      relations: ['requestedByUser', 'approvedByUser'],
      order: { createdAt: 'DESC' } 
    });
  }

  async create(data: Partial<Notification>) {
    const n = this.repo.create(data);
    return this.repo.save(n);
  }

  async getPendingApprovals() {
    return this.repo.find({
      where: {
        requires_approval: true,
        is_approved: false
      },
      relations: ['requestedByUser', 'group'],
      order: { createdAt: 'DESC' }
    });
  }

  async getUserGroupNotifications(userId: number) {
    // Get user's group notifications (approved ones)
    // Use the many-to-many relationship through group_members table
    const query = this.repo
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.group', 'group')
      .leftJoinAndSelect('notification.requestedByUser', 'requestedByUser')
      .leftJoinAndSelect('notification.approvedByUser', 'approvedByUser')
      .leftJoin('group_members', 'gm', 'gm.group_id = group.id')
      .where('notification.is_approved = :isApproved', { isApproved: true })
      .andWhere('gm.user_id = :userId', { userId })
      .orderBy('notification.createdAt', 'DESC');
    
    return query.getMany();
  }

  async approveNotification(notificationId: number, approverId: number, approved: boolean, notes?: string) {
    const notification = await this.repo.findOne({
      where: { id: notificationId },
      relations: ['requestedByUser']
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (!notification.requires_approval) {
      throw new NotFoundException('This notification does not require approval');
    }

    if (notification.is_approved) {
      throw new NotFoundException('This notification has already been processed');
    }

    notification.is_approved = approved;
    notification.approved_by_user_id = approverId;
    notification.approval_notes = notes || null;
    notification.approved_at = new Date();

    return this.repo.save(notification);
  }
}


