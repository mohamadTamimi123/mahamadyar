import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyBranchController } from './family-branch.controller';
import { FamilyBranchService } from './family-branch.service';
import { FamilyBranch } from './family-branch.entity';
import { People } from '../people/people.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FamilyBranch, People]),
  ],
  controllers: [FamilyBranchController],
  providers: [FamilyBranchService],
  exports: [FamilyBranchService],
})
export class FamilyBranchModule {}
