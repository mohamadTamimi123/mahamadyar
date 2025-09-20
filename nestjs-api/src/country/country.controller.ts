import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CountryService } from './country.service';
import { Country } from './country.entity';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll(@Query('search') search?: string): Promise<Country[]> {
    const countries = await this.countryService.findAll();
    
    if (search) {
      return countries.filter(country => 
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        country.region?.toLowerCase().includes(search.toLowerCase()) ||
        country.subregion?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return countries;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Country | null> {
    return this.countryService.findOne(+id);
  }

  @Get('iso/:code')
  async findByIsoCode(@Param('code') code: string): Promise<Country | null> {
    return this.countryService.findByIsoCode(code);
  }

  @Post()
  async create(@Body() countryData: Partial<Country>): Promise<Country> {
    return this.countryService.create(countryData);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() countryData: Partial<Country>): Promise<Country | null> {
    return this.countryService.update(+id, countryData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.countryService.delete(+id);
  }

  @Post('seed')
  async seedCountries(): Promise<{ message: string }> {
    await this.countryService.seedCountriesFromAPI();
    return { message: 'Countries seeded successfully from API' };
  }

  @Post('seed-cities')
  async seedCities(): Promise<{ message: string }> {
    await this.countryService.seedCitiesFromAPI();
    return { message: 'Cities seeded successfully from API' };
  }
}
