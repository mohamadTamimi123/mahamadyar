import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { FamilyMember } from '../entities/family-member.entity';

async function createTables() {
  console.log('🔄 ایجاد جدول‌ها با TypeORM...');
  
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Create tables based on entities
    await dataSource.synchronize();
    console.log('✅ جدول‌ها با موفقیت ایجاد شدند');
    
    // Check if tables exist
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'family%'
    `);
    
    console.log('📊 جدول‌های موجود:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ خطا در ایجاد جدول‌ها:', error);
  } finally {
    await app.close();
  }
}

// Run the script
createTables()
  .then(() => {
    console.log('🎉 ایجاد جدول‌ها تکمیل شد');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 خطا در اجرای اسکریپت:', error);
    process.exit(1);
  });
