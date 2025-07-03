import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengersService } from './passengers.service';
import { PassengersResolver } from './passengers.resolver';
import { Passenger } from './entities/passenger.entity';
import { User } from 'src/users/entites/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger, User])],
  providers: [PassengersService, PassengersResolver],
  exports: [PassengersService],
})
export class PassengersModule {}
