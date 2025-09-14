import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, NotFoundException, Query, Req } from '@nestjs/common';
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

  @Get(':id/family')
  async getImmediateFamily(@Param('id', ParseIntPipe) id: number) {
    return this.peopleService.getImmediateFamily(id);
  }

  @Get(':id/family-tree')
  async getFamilyTree(@Param('id', ParseIntPipe) id: number): Promise<People[]> {
    return this.peopleService.getFamilyTree(id);
  }

  @Post()
  async create(@Body() peopleData: Partial<People>, @Req() req: any): Promise<People> {
    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    return this.peopleService.create(peopleData, ipAddress, userAgent);
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

  @Post(':id/add-spouse')
  async addSpouse(
    @Param('id', ParseIntPipe) id: number,
    @Body() spouseData: { name: string; last_name: string },
    @Req() req: any,
  ): Promise<People> {
    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    return this.peopleService.addSpouse(id, spouseData, ipAddress, userAgent);
  }

  @Put(':id/complete-profile')
  async completeProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profileData: {
      birth_date?: string;
      birth_place?: string;
      job?: string;
      current_location?: string;
      profile_photo?: string;
    },
    @Req() req: any,
  ): Promise<People> {
    // Convert birth_date string to Date if provided
    const processedData = {
      ...profileData,
      birth_date: profileData.birth_date ? new Date(profileData.birth_date) : undefined,
    };
    
    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    return this.peopleService.completeProfile(id, processedData, ipAddress, userAgent);
  }
}
