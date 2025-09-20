import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FamilyTreeService, FamilyTreeNode } from './family-tree.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('family-tree')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FamilyTreeController {
  constructor(private readonly familyTreeService: FamilyTreeService) {}

  @Get('all')
  @Roles('admin', 'user')
  async getAllFamilyTrees(): Promise<FamilyTreeNode[]> {
    return this.familyTreeService.createFamilyTreeForAllPeople();
  }

  @Get('person/:id')
  @Roles('admin', 'user')
  async getFamilyTreeForPerson(@Param('id') id: number): Promise<FamilyTreeNode | null> {
    return this.familyTreeService.createFamilyTreeForPerson(id);
  }

  @Get('stats')
  @Roles('admin', 'user')
  async getFamilyTreeStats(): Promise<{
    totalPeople: number;
    totalFamilies: number;
    averageChildrenPerFamily: number;
    completedProfiles: number;
  }> {
    return this.familyTreeService.getFamilyTreeStats();
  }

  @Get('search')
  @Roles('admin', 'user')
  async searchInFamilyTree(@Query('q') searchTerm: string): Promise<FamilyTreeNode[]> {
    if (!searchTerm) {
      return [];
    }
    return this.familyTreeService.searchInFamilyTree(searchTerm);
  }
}
