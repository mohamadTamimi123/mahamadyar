import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function cleanDatabase() {
  console.log('🔄 پاک کردن جدول‌های اضافی...');
  
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    // Drop unnecessary tables
    const tablesToDrop = [
      'family_members',
      'family_relationships', 
      'family_tree_metadata'
    ];
    
    for (const tableName of tablesToDrop) {
      try {
        await dataSource.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
        console.log(`✅ جدول ${tableName} پاک شد`);
      } catch (error) {
        console.log(`⚠️ جدول ${tableName} وجود نداشت یا پاک نشد`);
      }
    }
    
    // Check remaining tables
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'family%'
    `);
    
    console.log('\n📊 جدول‌های باقی‌مانده:');
    tables.forEach((table: any) => {
      console.log(`  - ${table.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ خطا در پاک کردن جدول‌ها:', error);
  } finally {
    await app.close();
  }
}

// Run the script
cleanDatabase()
  .then(() => {
    console.log('🎉 پاک کردن جدول‌ها تکمیل شد');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 خطا در اجرای اسکریپت:', error);
    process.exit(1);
  });
