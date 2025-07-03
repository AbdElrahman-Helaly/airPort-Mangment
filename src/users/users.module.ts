import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { Passenger } from 'src/passengers/entities/passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), Passenger],
  providers: [UsersService, UsersResolver],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
