import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private repo: Repository<Event>,
  ) {}

  async list(group_id?: number) {
    if (group_id) return this.repo.find({ where: { group_id }, order: { date: 'DESC' } });
    return this.repo.find({ order: { date: 'DESC' } });
  }

  async create(data: Partial<Event>) {
    const e = this.repo.create(data);
    return this.repo.save(e);
  }
}


