import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from './city.entity';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<City[]> {
    if (search) {
      return this.cityService.search(search);
    }
    return this.cityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<City | null> {
    return this.cityService.findOne(+id);
  }

  @Get('country/:countryId')
  async findByCountry(@Param('countryId') countryId: string): Promise<City[]> {
    return this.cityService.findByCountry(+countryId);
  }

  @Post()
  async create(@Body() cityData: Partial<City>): Promise<City> {
    return this.cityService.create(cityData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() cityData: Partial<City>): Promise<City> {
    return this.cityService.update(+id, cityData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.cityService.delete(+id);
  }
}
