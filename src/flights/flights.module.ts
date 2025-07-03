import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './entities/flight.entity';
import { Airport } from 'src/airport/entities/airport.entity';
import { FlightsService } from './flights.service';
import { FlightsResolver } from './flights.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Flight, Airport])],
  providers: [FlightsService, FlightsResolver],
  exports: [FlightsService],
})
export class FlightsModule {}
