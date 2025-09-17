import { Injectable } from '@nestjs/common';
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
    return this.repo.find({ where: { group_id }, order: { createdAt: 'DESC' } });
  }

  async create(data: Partial<Notification>) {
    const n = this.repo.create(data);
    return this.repo.save(n);
  }
}


