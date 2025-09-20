import { Country } from '../country/country.entity';
export declare class City {
    id: number;
    name: string;
    country_id: number;
    country: Country;
    latitude: number;
    longitude: number;
    population: number;
    state_province: string;
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
}
