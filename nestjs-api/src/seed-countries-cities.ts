import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CountryService } from './country/country.service';

async function seedDatabase() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const countryService = app.get(CountryService);

  try {
    console.log('🌍 Starting database seeding...');
    
    // First seed countries
    console.log('📊 Seeding countries from REST Countries API...');
    await countryService.seedCountriesFromAPI();
    
    // Then seed cities
    console.log('🏙️ Seeding cities from GeoNames API...');
    await countryService.seedCitiesFromAPI();
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await app.close();
  }
}

seedDatabase();
