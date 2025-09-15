import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { config as loadEnv } from 'dotenv';
import { User } from './user.entity';

loadEnv();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'nestjs_db',
  entities: [User],
  synchronize: false,
});

async function main() {
  await AppDataSource.initialize();

  const repo = AppDataSource.getRepository(User);
  const email = process.env.SUPERADMIN_EMAIL || 'admin@example.com';
  const name = process.env.SUPERADMIN_NAME || 'Super Admin';
  const plainPassword = process.env.SUPERADMIN_PASSWORD || 'ChangeMe123!';

  let user = await repo.findOne({ where: { email } });
  const hashed = await bcrypt.hash(plainPassword, 10);

  if (!user) {
    user = repo.create({ email, name, password: hashed, role: 'admin' });
    await repo.save(user);
    // eslint-disable-next-line no-console
    console.log(`Created super admin: ${email}`);
  } else {
    user.name = name;
    user.password = hashed;
    user.role = 'admin';
    await repo.save(user);
    // eslint-disable-next-line no-console
    console.log(`Updated existing super admin: ${email}`);
  }

  await AppDataSource.destroy();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


