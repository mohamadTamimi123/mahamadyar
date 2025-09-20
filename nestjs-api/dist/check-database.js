"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const country_entity_1 = require("./country/country.entity");
const city_entity_1 = require("./city/city.entity");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 5432),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'nestjs_db',
    entities: [country_entity_1.Country, city_entity_1.City],
    synchronize: false,
});
async function checkDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('✅ Database connection established');
        const countryCount = await AppDataSource.getRepository(country_entity_1.Country).count();
        console.log(`📊 Total countries in database: ${countryCount}`);
        const cityCount = await AppDataSource.getRepository(city_entity_1.City).count();
        console.log(`🏙️ Total cities in database: ${cityCount}`);
        if (cityCount === 0) {
            console.log('❌ No cities found in database!');
            console.log('💡 You need to run: npm run seed:countries');
        }
        else {
            const citiesPerCountry = await AppDataSource
                .getRepository(country_entity_1.Country)
                .createQueryBuilder('country')
                .leftJoinAndSelect('country.cities', 'city')
                .select('country.name', 'countryName')
                .addSelect('COUNT(city.id)', 'cityCount')
                .groupBy('country.id, country.name')
                .orderBy('cityCount', 'DESC')
                .limit(10)
                .getRawMany();
            console.log('\n🏆 Top 10 countries by city count:');
            citiesPerCountry.forEach((row, index) => {
                console.log(`${index + 1}. ${row.countryName}: ${row.cityCount} cities`);
            });
        }
    }
    catch (error) {
        console.error('❌ Error checking database:', error);
    }
    finally {
        await AppDataSource.destroy();
    }
}
checkDatabase();
//# sourceMappingURL=check-database.js.map