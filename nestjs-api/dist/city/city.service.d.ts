import { Repository } from 'typeorm';
import { City } from './city.entity';
import { Country } from '../country/country.entity';
export declare class CityService {
    private cityRepository;
    private countryRepository;
    constructor(cityRepository: Repository<City>, countryRepository: Repository<Country>);
    findAll(): Promise<City[]>;
    findOne(id: number): Promise<City | null>;
    findByCountry(countryId: number): Promise<City[]>;
    search(searchTerm: string): Promise<City[]>;
    create(cityData: Partial<City>): Promise<City>;
    update(id: number, cityData: Partial<City>): Promise<City>;
    delete(id: number): Promise<void>;
}
