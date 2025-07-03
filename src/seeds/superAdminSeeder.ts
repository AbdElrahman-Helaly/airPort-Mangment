import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Role } from '../users/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entites/user.entity';

async function seedSuperAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);

  const email = 'superadmin@example.com';
  const existing = await userRepo.findOne({ where: { email } });

  if (existing) {
    console.log('Super Admin already exists');
    return await app.close();
  }

  const hashedPassword = await bcrypt.hash('SuperSecure123!', 10);

  const superAdmin = userRepo.create({
    email,
    password: hashedPassword,
    firstName: 'Super',
    lastName: 'Admin',
    role: Role.SUPER_ADMIN,
  });

  await userRepo.save(superAdmin);
  console.log('✅ Super Admin created!');
  await app.close();
}

seedSuperAdmin().catch((err) => {
  console.error('❌ Failed to seed super admin:', err);
});
