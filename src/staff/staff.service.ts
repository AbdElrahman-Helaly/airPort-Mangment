import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Flight } from 'src/flights/entities/flight.entity';
import { Staff } from './entities/staff.Entity';
import { CreateStaffInput } from './dtos/createStaff.Input';
import { AssignFlightsInput } from './dtos/assignFlights';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,

    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,
  ) {}

  async createStaff(input: CreateStaffInput): Promise<Staff> {
    const staff = this.staffRepo.create(input);
    return this.staffRepo.save(staff);
  }

  async getAllStaff(): Promise<Staff[]> {
    return this.staffRepo.find({ relations: ['assignedFlight'] });
  }

  async assignStaffToFlight(input: AssignFlightsInput): Promise<Staff> {
    const staff = await this.staffRepo.findOne({
      where: { id: input.staffId },
    });

    if (!staff) throw new NotFoundException('Staff member not found');

    const flight = await this.flightRepo.findOne({
      where: { id: input.flightId },
    });

    if (!flight) throw new NotFoundException('Flight not found');

    staff.assignedFlight = flight;
    return this.staffRepo.save(staff);
  }

  async updateStaff(
    id: string,
    input: Partial<CreateStaffInput>,
  ): Promise<Staff> {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) throw new NotFoundException('Staff member not found');

    Object.assign(staff, input);
    return this.staffRepo.save(staff);
  }

  async deleteStaff(id: string): Promise<boolean> {
    const result = await this.staffRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Staff member not found');
    }
    return true;
  }
}
