import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './staff.service';
import { Flight } from '../flights/entities/flight.entity';
import { Staff } from './entities/staff.Entity';
import { StaffResolver } from './staff.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, Flight])],
  providers: [StaffService, StaffResolver],
  exports: [StaffService],
})
export class StaffModule {}
