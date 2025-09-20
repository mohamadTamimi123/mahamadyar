import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';
import { Country } from './country/country.entity';
import { City } from './city/city.entity';

loadEnv();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nestjs_db',
  entities: [Country, City],
  synchronize: false,
});

async function checkDatabase() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Check countries count
    const countryCount = await AppDataSource.getRepository(Country).count();
    console.log(`📊 Total countries in database: ${countryCount}`);

    // Check cities count
    const cityCount = await AppDataSource.getRepository(City).count();
    console.log(`🏙️ Total cities in database: ${cityCount}`);

    if (cityCount === 0) {
      console.log('❌ No cities found in database!');
      console.log('💡 You need to run: npm run seed:countries');
    } else {
      // Show cities per country
      const citiesPerCountry = await AppDataSource
        .getRepository(Country)
        .createQueryBuilder('country')
        .leftJoinAndSelect('country.cities', 'city')
        .select('country.name', 'countryName')
        .addSelect('COUNT(city.id)', 'cityCount')
        .groupBy('country.id, country.name')
        .orderBy('COUNT(city.id)', 'DESC')
        .limit(10)
        .getRawMany();

      console.log('\n🏆 Top 10 countries by city count:');
      citiesPerCountry.forEach((row, index) => {
        console.log(`${index + 1}. ${row.countryName}: ${row.cityCount} cities`);
      });
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

checkDatabase();
