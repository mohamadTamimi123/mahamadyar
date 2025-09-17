import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groups: GroupsService) {}

  @Get('my')
  async myGroup(
    @Query('country') country: string,
    @Query('city') city: string,
  ) {
    return this.groups.findMyGroup(country, city);
  }

  @Post('ensure')
  async ensure(
    @Body() body: { country: string; city: string; leader_user_id?: number },
  ) {
    return this.groups.findOrCreate(body.country, body.city, body.leader_user_id);
  }
}


