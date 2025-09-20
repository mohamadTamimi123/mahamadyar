import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';
import { Country } from '../country/country.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<City[]> {
    return this.cityRepository.find({
      relations: ['country'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<City> {
    return this.cityRepository.findOne({
      where: { id },
      relations: ['country']
    });
  }

  async findByCountry(countryId: number): Promise<City[]> {
    return this.cityRepository.find({
      where: { country_id: countryId },
      relations: ['country'],
      order: { name: 'ASC' }
    });
  }

  async search(searchTerm: string): Promise<City[]> {
    return this.cityRepository
      .createQueryBuilder('city')
      .leftJoinAndSelect('city.country', 'country')
      .where('city.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('country.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('city.name', 'ASC')
      .getMany();
  }

  async create(cityData: Partial<City>): Promise<City> {
    const city = this.cityRepository.create(cityData);
    return this.cityRepository.save(city);
  }

  async update(id: number, cityData: Partial<City>): Promise<City> {
    await this.cityRepository.update(id, cityData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.cityRepository.delete(id);
  }
}
