import { People } from '../people/people.entity';
import { Photo } from '../photo/photo.entity';
import { Country } from '../country/country.entity';
import { City } from '../city/city.entity';
import { FamilyBranch } from '../family-branch/family-branch.entity';
import { Group } from '../groups/group.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    password: string;
    phone: string;
    people_id: number;
    people: People;
    photos: Photo[];
    familyBranches: FamilyBranch[];
    createdGroups: Group[];
    groups: Group[];
    role: string;
    country_id: number;
    country: Country;
    city_id: number;
    city: City;
    createdAt: Date;
    updatedAt: Date;
}
