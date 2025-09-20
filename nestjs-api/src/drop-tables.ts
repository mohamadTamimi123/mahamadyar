import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function dropTables() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    console.log('🗑️ Dropping existing tables...');
    await dataSource.dropDatabase();
    await dataSource.synchronize();
    console.log('✅ Tables dropped and recreated successfully!');
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
  } finally {
    await app.close();
  }
}

dropTables();
