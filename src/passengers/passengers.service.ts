import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entites/user.entity';
import { CreatePassengerInput } from './dtos/createPassengerInput';
import { Role } from 'src/users/enums/role.enum';
import { Passenger } from './entities/passenger.entity';
import { UpdatePassengerInput } from './dtos/updatePassengerInput';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private passengerRepo: Repository<Passenger>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(
    input: CreatePassengerInput,
    userId: string,
  ): Promise<Passenger> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.role !== Role.PASSENGER)
      throw new ForbiddenException(
        'Only passengers can create passenger profiles',
      );

    const exists = await this.passengerRepo.findOne({
      where: { user: { id: userId } },
    });
    if (exists) throw new ConflictException('Passenger profile already exists');

    const passenger = this.passengerRepo.create({ ...input, user });
    return this.passengerRepo.save(passenger);
  }

  async getPassengerByUser(user: User): Promise<Passenger> {
    const passenger = await this.passengerRepo.findOne({
      where: { user: { id: user.id } },
    });
    if (!passenger) {
      throw new NotFoundException('Passenger profile not found');
    }
    return passenger;
  }

  async findOne(id: string): Promise<Passenger> {
    const passenger = await this.passengerRepo.findOne({ where: { id } });
    if (!passenger) throw new NotFoundException('Passenger not found');
    return passenger;
  }

  async findAll(): Promise<Passenger[]> {
    return this.passengerRepo.find({ relations: ['user'] });
  }

  async update(id: string, input: UpdatePassengerInput): Promise<Passenger> {
    const passenger = await this.findOne(id);
    Object.assign(passenger, input);
    return this.passengerRepo.save(passenger);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.passengerRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Passenger not found');
    return true;
  }
}
