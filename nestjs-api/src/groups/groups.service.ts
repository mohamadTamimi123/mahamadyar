import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './group.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private repo: Repository<Group>,
  ) {}

  findOrCreate(country: string, city: string, leader_user_id?: number | null) {
    const name = `${country}/${city}`;
    return this.repo
      .findOne({ where: { country, city } })
      .then(async (g) => {
        if (g) return g;
        const created = this.repo.create({ country, city, name, leader_user_id: leader_user_id ?? null });
        return this.repo.save(created);
      });
  }

  findMyGroup(country: string, city: string) {
    return this.repo.findOne({ where: { country, city } });
  }
}


