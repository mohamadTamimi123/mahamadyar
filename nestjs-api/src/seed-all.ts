import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { seedSuperAdmin } from './user/seed-super-admin';
import { seedCountriesAndCities } from './seed-countries-cities';

loadEnv();

async function main() {
  try {
    console.log('🚀 Running all seeders...');
    await seedSuperAdmin();
    await seedCountriesAndCities();
    console.log('✅ All seeders completed successfully');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}


