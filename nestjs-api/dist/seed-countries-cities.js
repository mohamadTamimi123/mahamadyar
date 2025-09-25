"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCountriesAndCities = seedCountriesAndCities;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const country_service_1 = require("./country/country.service");
async function seedCountriesAndCities() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const countryService = app.get(country_service_1.CountryService);
    try {
        console.log('🌍 Starting database seeding...');
        console.log('📊 Seeding countries from REST Countries API...');
        await countryService.seedCountriesFromAPI();
        console.log('🏙️ Seeding cities from GeoNames API...');
        await countryService.seedCitiesFromAPI();
        console.log('✅ Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
    }
    finally {
        await app.close();
    }
}
if (require.main === module) {
    seedCountriesAndCities();
}
//# sourceMappingURL=seed-countries-cities.js.map