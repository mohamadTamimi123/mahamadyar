import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  async list(@Query('group_id') group_id?: number) {
    return this.events.list(group_id ? +group_id : undefined);
  }

  @Post()
  async create(
    @Body()
    body: { group_id?: number; type: string; title: string; date: string; location?: string; description?: string },
  ) {
    const payload: any = {
      group_id: body.group_id ?? null,
      type: body.type,
      title: body.title,
      date: new Date(body.date),
    };
    if (body.location) payload.location = body.location;
    if (body.description) payload.description = body.description;
    return this.events.create(payload);
  }
}


