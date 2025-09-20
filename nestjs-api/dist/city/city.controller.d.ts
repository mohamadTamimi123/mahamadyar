import { CityService } from './city.service';
import { City } from './city.entity';
export declare class CityController {
    private readonly cityService;
    constructor(cityService: CityService);
    findAll(search?: string): Promise<City[]>;
    findOne(id: string): Promise<City | null>;
    findByCountry(countryId: string): Promise<City[]>;
    create(cityData: Partial<City>): Promise<City>;
    update(id: string, cityData: Partial<City>): Promise<City>;
    delete(id: string): Promise<void>;
}
