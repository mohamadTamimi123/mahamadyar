import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyMember } from './entities/family-member.entity';
import { User } from './entities/user.entity';
import { FamilyMemberService } from './family-member.service';
import { FamilyMemberController } from './family-member.controller';
import { EmailService } from './services/email.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([FamilyMember, User])],
  controllers: [FamilyMemberController],
  providers: [FamilyMemberService, EmailService],
  exports: [FamilyMemberService],
})
export class FamilyMemberModule {}
