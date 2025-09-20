import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FamilyBranchService } from './family-branch.service';
import { FamilyBranch } from './family-branch.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('family-branches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FamilyBranchController {
  constructor(private readonly familyBranchService: FamilyBranchService) {}

  @Post()
  @Roles('admin', 'user')
  async create(@Body() createData: {
    name: string;
    description?: string;
    generation_level?: number;
    branch_color?: string;
    created_by_user_id: number;
    root_person_id?: number;
    parent_branch_id?: number;
  }): Promise<FamilyBranch> {
    return this.familyBranchService.create(createData);
  }

  @Get()
  @Roles('admin', 'user')
  async findAll(): Promise<FamilyBranch[]> {
    return this.familyBranchService.findAll();
  }

  @Get('user/:userId')
  @Roles('admin', 'user')
  async findByUser(@Param('userId') userId: number): Promise<FamilyBranch[]> {
    return this.familyBranchService.findByUser(userId);
  }

  @Get('hierarchy')
  @Roles('admin', 'user')
  async getHierarchy(): Promise<FamilyBranch[]> {
    return this.familyBranchService.getBranchHierarchy();
  }

  @Get('stats')
  @Roles('admin', 'user')
  async getStats(): Promise<{
    totalBranches: number;
    activeBranches: number;
    totalMembers: number;
    averageMembersPerBranch: number;
  }> {
    return this.familyBranchService.getBranchStats();
  }

  @Get(':id')
  @Roles('admin', 'user')
  async findOne(@Param('id') id: number): Promise<FamilyBranch | null> {
    return this.familyBranchService.findOne(id);
  }

  @Put(':id')
  @Roles('admin', 'user')
  async update(@Param('id') id: number, @Body() updateData: Partial<FamilyBranch>): Promise<FamilyBranch | null> {
    return this.familyBranchService.update(id, updateData);
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: number): Promise<{ message: string }> {
    await this.familyBranchService.delete(id);
    return { message: 'شاخه خانوادگی با موفقیت حذف شد' };
  }

  @Post(':id/members/:personId')
  @Roles('admin', 'user')
  async addMember(@Param('id') branchId: number, @Param('personId') personId: number): Promise<FamilyBranch | null> {
    return this.familyBranchService.addMemberToBranch(branchId, personId);
  }

  @Delete(':id/members/:personId')
  @Roles('admin', 'user')
  async removeMember(@Param('id') branchId: number, @Param('personId') personId: number): Promise<FamilyBranch | null> {
    return this.familyBranchService.removeMemberFromBranch(branchId, personId);
  }
}
