import { Repository } from 'typeorm';
import { Country } from './country.entity';
import { City } from '../city/city.entity';
export declare class CountryService {
    private countryRepository;
    private cityRepository;
    constructor(countryRepository: Repository<Country>, cityRepository: Repository<City>);
    findAll(): Promise<Country[]>;
    findOne(id: number): Promise<Country>;
    findByIsoCode(isoCode: string): Promise<Country>;
    create(countryData: Partial<Country>): Promise<Country>;
    update(id: number, countryData: Partial<Country>): Promise<Country>;
    delete(id: number): Promise<void>;
    seedCountriesFromAPI(): Promise<void>;
    seedCitiesFromAPI(): Promise<void>;
}
