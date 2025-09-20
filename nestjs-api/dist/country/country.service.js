"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("./country.entity");
const city_entity_1 = require("../city/city.entity");
const axios_1 = __importDefault(require("axios"));
let CountryService = class CountryService {
    countryRepository;
    cityRepository;
    constructor(countryRepository, cityRepository) {
        this.countryRepository = countryRepository;
        this.cityRepository = cityRepository;
    }
    async findAll() {
        return this.countryRepository.find({
            relations: ['cities'],
            order: { name: 'ASC' }
        });
    }
    async findOne(id) {
        return this.countryRepository.findOne({
            where: { id },
            relations: ['cities']
        });
    }
    async findByIsoCode(isoCode) {
        return this.countryRepository.findOne({
            where: { iso_code: isoCode },
            relations: ['cities']
        });
    }
    async create(countryData) {
        const country = this.countryRepository.create(countryData);
        return this.countryRepository.save(country);
    }
    async update(id, countryData) {
        await this.countryRepository.update(id, countryData);
        return this.findOne(id);
    }
    async delete(id) {
        await this.countryRepository.delete(id);
    }
    async seedCountriesFromAPI() {
        try {
            console.log('Starting to seed countries from REST Countries API...');
            const response = await axios_1.default.get('https://restcountries.com/v3.1/all?fields=name,cca3,capital,population,area,region,subregion,flags,currencies,languages');
            const countries = response.data;
            for (const countryData of countries) {
                const existingCountry = await this.countryRepository.findOne({
                    where: { iso_code: countryData.cca3 }
                });
                if (!existingCountry) {
                    const countryDataToCreate = {
                        name: countryData.name.common,
                        iso_code: countryData.cca3,
                        capital: countryData.capital?.[0] || undefined,
                        population: countryData.population || undefined,
                        area: countryData.area || undefined,
                        region: countryData.region || undefined,
                        subregion: countryData.subregion || undefined,
                        flag_url: countryData.flags?.png || undefined,
                        currency_code: countryData.currencies ? Object.keys(countryData.currencies)[0] : undefined,
                        currency_name: countryData.currencies ? Object.values(countryData.currencies)[0]?.name : undefined,
                        language_code: countryData.languages ? Object.keys(countryData.languages)[0] : undefined,
                        language_name: countryData.languages ? Object.values(countryData.languages)[0] : undefined,
                    };
                    const country = this.countryRepository.create(countryDataToCreate);
                    await this.countryRepository.save(country);
                    console.log(`Added country: ${country.name}`);
                }
            }
            console.log('Countries seeding completed successfully!');
        }
        catch (error) {
            console.error('Error seeding countries:', error);
            throw error;
        }
    }
    async seedCitiesFromAPI() {
        try {
            console.log('Starting to seed cities from GeoNames API...');
            const countries = await this.countryRepository.find();
            for (const country of countries) {
                try {
                    const response = await axios_1.default.get(`http://api.geonames.org/searchJSON?country=${country.iso_code}&maxRows=50&username=demo&featureClass=P&orderby=population`);
                    const cities = response.data.geonames || [];
                    for (const cityData of cities) {
                        const existingCity = await this.cityRepository.findOne({
                            where: {
                                name: cityData.name,
                                country_id: country.id
                            }
                        });
                        if (!existingCity) {
                            const cityDataToCreate = {
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
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                catch (error) {
                    console.error(`Error fetching cities for ${country.name}:`, error.message);
                    continue;
                }
            }
            console.log('Cities seeding completed successfully!');
        }
        catch (error) {
            console.error('Error seeding cities:', error);
            throw error;
        }
    }
};
exports.CountryService = CountryService;
exports.CountryService = CountryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(1, (0, typeorm_1.InjectRepository)(city_entity_1.City)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CountryService);
//# sourceMappingURL=country.service.js.map