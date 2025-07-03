import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, Between } from 'typeorm';
import { Flight } from './entities/flight.entity';
import { CreateFlightInput } from './dtos/createFlightInput';
import { UpdateFlightInput } from './dtos/updateFlightInput';
import { PaginationInput } from './dtos/paginationInput';
import { FlightFilterInput } from './dtos/filterFlightInput';
import { pubSub } from 'src/pubsub';
import { Airport } from 'src/airport/entities/airport.entity';
@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,
    @InjectRepository(Airport)
    private readonly airportRepo: Repository<Airport>,
  ) {}

  async createFlight(input: CreateFlightInput): Promise<Flight> {
    const airport = await this.airportRepo.findOne({
      where: { id: input.airportId },
    });
    if (!airport) throw new NotFoundException('Airport not found');
    const existing = await this.flightRepo.findOne({
      where: { flightNumber: input.flightNumber },
    });
    if (existing) {
      throw new BadRequestException('Flight number already exists');
    }
    const flight = this.flightRepo.create({
      ...input,
      airport,
    });
    return this.flightRepo.save(flight);
  }

  async updateFlight(input: UpdateFlightInput): Promise<Flight> {
    const flight = await this.flightRepo.findOne({
      where: { id: input.flightId },
    });
    if (!flight) throw new NotFoundException('Flight not found');
    delete input['airportId'];
    const originalStatus = flight.status;
    Object.assign(flight, input);

    const updated = await this.flightRepo.save(flight);

    if (updated.status !== originalStatus) {
      await pubSub.publish('flightStatusUpdated', {
        flightStatusUpdated: updated,
      });
    }

    return updated;
  }

  async deleteFlight(id: string): Promise<boolean> {
    const result = await this.flightRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Flight not found');
    }
    return true;
  }

  async getFlights(
    pagination: PaginationInput,
    filter?: FlightFilterInput,
  ): Promise<{ flights: Flight[]; total: number }> {
    const { page, limit } = pagination;

    const where: any = {};
    if (filter) {
      if (filter.departureTime) {
        const date = new Date(filter.departureTime);
        where.departureTime = Between(
          new Date(date.setHours(0, 0, 0)),
          new Date(date.setHours(23, 59, 59)),
        );
      }
      if (filter.Airport) {
        where.destinationAirport = Like(`%${filter.Airport}%`);
      }
      if (filter.airline) {
        where.airline = Like(`%${filter.airline}%`);
      }
    }

    const [flights, total] = await this.flightRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { departureTime: 'ASC' },
    });

    return { flights, total };
  }
}
