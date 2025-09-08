import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function alterUsersAddOtpColumns() {
  console.log('🔄 افزودن ستون‌های OTP به جدول users در صورت نبود...');
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await dataSource.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR NULL;`);
    await dataSource.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP NULL;`);
    await dataSource.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_attempts INT DEFAULT 0;`);
    await dataSource.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_last_sent_at TIMESTAMP NULL;`);
    console.log('✅ ستون‌های OTP بررسی/ایجاد شدند');
  } catch (error) {
    console.error('❌ خطا در افزودن ستون‌های OTP:', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

alterUsersAddOtpColumns()
  .then(() => console.log('🎉 عملیات تغییر جدول users پایان یافت'))
  .catch((err) => {
    console.error('💥 خطا در اجرای اسکریپت:', err);
    process.exit(1);
  });


