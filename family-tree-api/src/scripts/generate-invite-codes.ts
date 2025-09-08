import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { FamilyMemberService } from '../family-member.service';

async function generateInviteCodes() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const familyMemberService = app.get(FamilyMemberService);

  try {
    console.log('شروع تولید کدهای دعوت برای همه اعضا...');
    
    // دریافت همه اعضا
    const allMembers = await familyMemberService.findAll();
    console.log(`تعداد کل اعضا: ${allMembers.length}`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const member of allMembers) {
      try {
        // اگر کد دعوت ندارند، تولید کن
        if (!member.invite_code) {
          const updatedMember = await familyMemberService.generateNewInviteCode(member.id);
          if (updatedMember) {
            console.log(`کد دعوت برای ${member.name} (ID: ${member.id}) تولید شد: ${updatedMember.invite_code}`);
            successCount++;
          } else {
            console.error(`خطا در تولید کد دعوت برای ${member.name} (ID: ${member.id})`);
            errorCount++;
          }
        } else {
          console.log(`${member.name} (ID: ${member.id}) قبلاً کد دعوت دارد: ${member.invite_code}`);
        }
      } catch (error) {
        console.error(`خطا در پردازش ${member.name} (ID: ${member.id}):`, error.message);
        errorCount++;
      }
    }
    
    console.log('\nخلاصه:');
    console.log(`تعداد کل اعضا: ${allMembers.length}`);
    console.log(`کدهای دعوت تولید شده: ${successCount}`);
    console.log(`خطاها: ${errorCount}`);
    
  } catch (error) {
    console.error('خطا در تولید کدهای دعوت:', error);
  } finally {
    await app.close();
  }
}

generateInviteCodes();
