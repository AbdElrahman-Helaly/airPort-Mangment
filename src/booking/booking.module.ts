import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from '../flights/entities/flight.entity';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { Booking } from './entities/booking.entity';
import { Passenger } from 'src/passengers/entities/passenger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Flight, Passenger])],
  providers: [BookingService, BookingResolver],
})
export class BookingModule {}
