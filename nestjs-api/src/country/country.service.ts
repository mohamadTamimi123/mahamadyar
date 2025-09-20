import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { City } from '../city/city.entity';
import axios from 'axios';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async findAll(): Promise<Country[]> {
    return this.countryRepository.find({
      relations: ['cities'],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: number): Promise<Country | null> {
    return this.countryRepository.findOne({
      where: { id },
      relations: ['cities']
    });
  }

  async findByIsoCode(isoCode: string): Promise<Country | null> {
    return this.countryRepository.findOne({
      where: { iso_code: isoCode },
      relations: ['cities']
    });
  }

  async create(countryData: Partial<Country>): Promise<Country> {
    const country = this.countryRepository.create(countryData);
    return this.countryRepository.save(country);
  }

  async update(id: number, countryData: Partial<Country>): Promise<Country | null> {
    await this.countryRepository.update(id, countryData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.countryRepository.delete(id);
  }

  async seedCountriesFromAPI(): Promise<void> {
    try {
      console.log('Starting to seed countries from REST Countries API...');
      
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca3,capital,population,area,region,subregion,flags,currencies,languages');
      const countries = response.data;

      for (const countryData of countries) {
        const existingCountry = await this.countryRepository.findOne({
          where: { iso_code: countryData.cca3 }
        });

        if (!existingCountry) {
          const countryDataToCreate: Partial<Country> = {
            name: countryData.name.common,
            iso_code: countryData.cca3,
            capital: countryData.capital?.[0] || undefined,
            population: countryData.population || undefined,
            area: countryData.area || undefined,
            region: countryData.region || undefined,
            subregion: countryData.subregion || undefined,
            flag_url: countryData.flags?.png || undefined,
            currency_code: countryData.currencies ? Object.keys(countryData.currencies)[0] : undefined,
            currency_name: countryData.currencies ? (Object.values(countryData.currencies)[0] as any)?.name : undefined,
            language_code: countryData.languages ? Object.keys(countryData.languages)[0] : undefined,
            language_name: countryData.languages ? (Object.values(countryData.languages)[0] as string) : undefined,
          };

          const country = this.countryRepository.create(countryDataToCreate);
          await this.countryRepository.save(country);
          console.log(`Added country: ${country.name}`);
        }
      }

      console.log('Countries seeding completed successfully!');
    } catch (error) {
      console.error('Error seeding countries:', error);
      throw error;
    }
  }

  async seedCitiesFromAPI(): Promise<void> {
    try {
      console.log('Starting to seed cities from GeoNames API...');
      
      // Get all countries first
      const countries = await this.countryRepository.find();
      
      for (const country of countries) {
        try {
          // Use GeoNames API to get cities for each country
          const response = await axios.get(
            `http://api.geonames.org/searchJSON?country=${country.iso_code}&maxRows=50&username=demo&featureClass=P&orderby=population`
          );
          
          const cities = response.data.geonames || [];
          
          for (const cityData of cities) {
            const existingCity = await this.cityRepository.findOne({
              where: { 
                name: cityData.name,
                country_id: country.id 
              }
            });

            if (!existingCity) {
              const cityDataToCreate: Partial<City> = {
                name: cityData.name,
                country_id: country.id,
                latitude: cityData.lat ? parseFloat(cityData.lat) : undefined,
                longitude: cityData.lng ? parseFloat(cityData.lng) : undefined,
                population: cityData.population || undefined,
                state_province: cityData.adminName1 || undefined,
                timezone: cityData.timezone || undefined,
              };

              const city = this.cityRepository.create(cityDataToCreate);
              await this.cityRepository.save(city);
            }
          }
          
          console.log(`Added cities for country: ${country.name}`);
          
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 2000));
          
        } catch (error) {
          console.error(`Error fetching cities for ${country.name}:`, error.message);
          continue;
        }
      }

      console.log('Cities seeding completed successfully!');
    } catch (error) {
      console.error('Error seeding cities:', error);
      throw error;
    }
  }
}
