import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';

async function createUsersTable() {
  console.log('🔄 ایجاد جدول users بدون synchronize...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    await dataSource.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        member_id INTEGER UNIQUE REFERENCES family_members(id) ON DELETE CASCADE,
        otp_code VARCHAR NULL,
        otp_expires_at TIMESTAMP NULL,
        otp_attempts INT DEFAULT 0,
        otp_last_sent_at TIMESTAMP NULL
      );
    `);

    await dataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_users_member_id ON users(member_id);
    `);

    console.log('✅ جدول users با موفقیت ایجاد/بررسی شد');
  } catch (error) {
    console.error('❌ خطا در ایجاد جدول users:', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

createUsersTable()
  .then(() => {
    console.log('🎉 عملیات ایجاد جدول users پایان یافت');
  })
  .catch((err) => {
    console.error('💥 خطا در اجرای اسکریپت:', err);
    process.exit(1);
  });


