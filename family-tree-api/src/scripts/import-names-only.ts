import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FamilyMemberService } from '../family-member.service';
import * as fs from 'fs';
import * as path from 'path';

async function importNamesOnly() {
  console.log('🔄 ایمپورت فقط نام‌ها از فایل JSON...');
  
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const familyService = app.get(FamilyMemberService);

  try {
    // Read JSON file
    const dataPath = path.join(__dirname, '../../../data/family-tree-complete.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`📊 تعداد کل اعضا در فایل JSON: ${jsonData.length}`);
    
    // Import only names
    const result = await familyService.importNamesFromJson(jsonData);
    
    console.log('\n📈 خلاصه نتایج:');
    console.log(`✅ تعداد ایمپورت‌های موفق: ${result.imported}`);
    console.log(`❌ تعداد خطاها: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('\n❌ خطاها:');
      result.errors.slice(0, 10).forEach((error, index) => {
        console.log(`${index + 1}. ${error.error}`);
      });
      if (result.errors.length > 10) {
        console.log(`... و ${result.errors.length - 10} خطای دیگر`);
      }
    }
    
    // Verify the import
    console.log('\n📊 بررسی نهایی...');
    const totalCount = await familyService.getTotalCount();
    console.log(`📊 تعداد کل اعضا در دیتابیس: ${totalCount}`);
    
  } catch (error) {
    console.error('❌ خطا در پردازش:', error);
  } finally {
    await app.close();
  }
}

// Run the script
importNamesOnly()
  .then(() => {
    console.log('🎉 ایمپورت نام‌ها تکمیل شد');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 خطا در اجرای اسکریپت:', error);
    process.exit(1);
  });
