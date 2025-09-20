import { CountryService } from './country.service';
import { Country } from './country.entity';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    findAll(search?: string): Promise<Country[]>;
    findOne(id: string): Promise<Country | null>;
    findByIsoCode(code: string): Promise<Country | null>;
    create(countryData: Partial<Country>): Promise<Country>;
    update(id: string, countryData: Partial<Country>): Promise<Country>;
    delete(id: string): Promise<void>;
    seedCountries(): Promise<{
        message: string;
    }>;
    seedCities(): Promise<{
        message: string;
    }>;
}
