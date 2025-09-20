import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { FamilyTreeController } from './family-tree.controller';
import { FamilyTreeService } from './family-tree.service';
import { People } from './people.entity';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([People]),
    ActivityLogModule,
  ],
  controllers: [PeopleController, FamilyTreeController],
  providers: [PeopleService, FamilyTreeService],
  exports: [FamilyTreeService],
})
export class PeopleModule {}
