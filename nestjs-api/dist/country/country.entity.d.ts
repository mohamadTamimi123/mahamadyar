import { City } from '../city/city.entity';
export declare class Country {
    id: number;
    name: string;
    iso_code: string;
    capital: string;
    population: number;
    area: number;
    region: string;
    subregion: string;
    flag_url: string;
    currency_code: string;
    currency_name: string;
    language_code: string;
    language_name: string;
    cities: City[];
    createdAt: Date;
    updatedAt: Date;
}
