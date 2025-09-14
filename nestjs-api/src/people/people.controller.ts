import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, NotFoundException, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { People } from './people.entity';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get()
  async findAll(@Query('with') withParam?: string): Promise<People[]> {
    if (withParam === 'fathers') {
      return this.peopleService.findAllWithFathers();
    } else if (withParam === 'children') {
      return this.peopleService.findAllWithChildren();
    } else if (withParam === 'root') {
      return this.peopleService.findRootPeople();
    }
    return this.peopleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<People> {
    const people = await this.peopleService.findOne(id);
    if (!people) {
      throw new NotFoundException(`People with ID ${id} not found`);
    }
    return people;
  }

  @Get('father/:fatherId')
  async findByFatherId(@Param('fatherId', ParseIntPipe) fatherId: number): Promise<People[]> {
    return this.peopleService.findByFatherId(fatherId);
  }

  @Get('code/:registrationCode')
  async findByRegistrationCode(@Param('registrationCode') registrationCode: string): Promise<People> {
    const people = await this.peopleService.findByRegistrationCode(registrationCode);
    if (!people) {
      throw new NotFoundException(`People with registration code ${registrationCode} not found`);
    }
    return people;
  }

  @Post()
  async create(@Body() peopleData: Partial<People>): Promise<People> {
    return this.peopleService.create(peopleData);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() peopleData: Partial<People>,
  ): Promise<People> {
    return this.peopleService.update(id, peopleData);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.peopleService.remove(id);
  }
}
