import { Module } from '@nestjs/common';
import { BaggageService } from './baggage.service';
import { BaggageResolver } from './baggage.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Baggage } from './entites/baggage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Baggage, Passenger])],
  providers: [BaggageService, BaggageResolver],
})
export class BaggageModule {}
