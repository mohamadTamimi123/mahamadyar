import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FamilyMemberService } from '../family-member.service';
import * as fs from 'fs';
import * as path from 'path';

async function importWithRelationships() {
  console.log('🔄 ایمپورت داده‌ها با روابط خانوادگی...');
  
  // Create NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule);
  const familyService = app.get(FamilyMemberService);

  try {
    // Read JSON file
    const dataPath = path.join(__dirname, '../../../data/family-tree-complete.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`📊 تعداد کل اعضا در فایل JSON: ${jsonData.length}`);
    
    // First, import all members without relationships
    console.log('📝 مرحله ۱: ایمپورت اعضا بدون روابط...');
    const result = await familyService.importNamesFromJson(jsonData);
    console.log(`✅ تعداد ایمپورت‌های موفق: ${result.imported}`);
    console.log(`❌ تعداد خطاها: ${result.errors.length}`);
    
    // Second, establish relationships
    console.log('\n🔗 مرحله ۲: ایجاد روابط خانوادگی...');
    let relationshipsCreated = 0;
    let relationshipErrors = 0;
    
    for (const item of jsonData) {
      try {
        if (!item.personName || !item.fatherName) {
          continue;
        }
        
        // Find child by name
        const child = await familyService.searchByName(item.personName);
        if (child.length === 0) continue;
        
        // Find father by name
        const father = await familyService.searchByName(item.fatherName);
        if (father.length === 0) continue;
        
        // Set relationship
        const updatedChild = await familyService.setParent(child[0].id, father[0].id);
        if (updatedChild) {
          relationshipsCreated++;
        }
        
      } catch (error) {
        relationshipErrors++;
        console.log(`⚠️ خطا در ایجاد رابطه برای ${item.personName}: ${error.message}`);
      }
    }
    
    console.log(`\n📈 خلاصه نتایج روابط:`);
    console.log(`✅ روابط ایجاد شده: ${relationshipsCreated}`);
    console.log(`❌ خطاهای رابطه: ${relationshipErrors}`);
    
    // Verify the import
    console.log('\n📊 بررسی نهایی...');
    const totalCount = await familyService.getTotalCount();
    const rootMembers = await familyService.getRootMembers();
    console.log(`📊 تعداد کل اعضا در دیتابیس: ${totalCount}`);
    console.log(`🌳 تعداد ریشه‌های درخت: ${rootMembers.length}`);
    
    // Show some sample relationships
    console.log('\n🔍 نمونه روابط ایجاد شده:');
    const sampleMembers = await familyService.findAll();
    const membersWithChildren = sampleMembers.filter(m => m.children && m.children.length > 0);
    
    for (let i = 0; i < Math.min(5, membersWithChildren.length); i++) {
      const member = membersWithChildren[i];
      console.log(`👨‍👧‍👦 ${member.name} (${member.children.length} فرزند)`);
      member.children.slice(0, 3).forEach(child => {
        console.log(`   └── ${child.name}`);
      });
      if (member.children.length > 3) {
        console.log(`   └── ... و ${member.children.length - 3} فرزند دیگر`);
      }
    }
    
  } catch (error) {
    console.error('❌ خطا در پردازش:', error);
  } finally {
    await app.close();
  }
}

// Run the script
importWithRelationships()
  .then(() => {
    console.log('🎉 ایمپورت با روابط تکمیل شد');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 خطا در اجرای اسکریپت:', error);
    process.exit(1);
  });
