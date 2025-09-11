import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { FamilyMember } from '../entities/family-member.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'secure_password_123',
  database: process.env.DB_DATABASE || 'family_tree_db',
  entities: [User, FamilyMember],
  synchronize: false, // We'll use migrations
});

async function addProfileFields() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    // Add profile fields to users table
    console.log('📝 Adding profile fields to users table...');
    await queryRunner.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_image VARCHAR NULL,
      ADD COLUMN IF NOT EXISTS national_id VARCHAR NULL
    `);

    // Add profile fields to family_members table
    console.log('📝 Adding profile fields to family_members table...');
    await queryRunner.query(`
      ALTER TABLE family_members 
      ADD COLUMN IF NOT EXISTS profile_image VARCHAR NULL,
      ADD COLUMN IF NOT EXISTS national_id VARCHAR NULL
    `);

    await queryRunner.release();
    console.log('✅ Profile fields added successfully!');
    
    // Verify the changes
    console.log('🔍 Verifying changes...');
    const userColumns = await AppDataSource.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('profile_image', 'national_id')
    `);
    
    const memberColumns = await AppDataSource.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'family_members' 
      AND column_name IN ('profile_image', 'national_id')
    `);

    console.log('Users table profile fields:', userColumns);
    console.log('Family members table profile fields:', memberColumns);

  } catch (error) {
    console.error('❌ Error adding profile fields:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

addProfileFields();
