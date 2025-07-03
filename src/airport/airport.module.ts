import { Module } from '@nestjs/common';
import { AirportService } from './airport.service';
import { AirportResolver } from './airport.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
  providers: [AirportService, AirportResolver],
})
export class AirportModule {}
