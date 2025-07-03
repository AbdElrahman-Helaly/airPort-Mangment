import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Airport } from './entities/airport.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(Airport)
    private airportRepo: Repository<Airport>,
  ) {}

  findAll() {
    return this.airportRepo.find();
  }

  findOne(id: string) {
    return this.airportRepo.findOne({ where: { id } });
  }

  async getFlightsForAirport(id: string) {
    const airport = await this.airportRepo.findOne({
      where: { id },
      relations: ['flights'],
    });
    return airport?.flights || [];
  }
}
