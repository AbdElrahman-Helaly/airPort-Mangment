import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Baggage } from './entites/baggage.entity';
import { CreateBaggageInput } from './dtos/create.Baggage.Input';
import { UpdateBaggageStatusInput } from './dtos/update.Baggage.input';
import { BaggageStatus } from './enums/baggageStatus';
import { pubSub } from 'src/pubsub';

@Injectable()
export class BaggageService {
  constructor(
    @InjectRepository(Baggage)
    private baggageRepo: Repository<Baggage>,
  ) {}

  async create(input: CreateBaggageInput, passenger: Passenger) {
    const baggage = this.baggageRepo.create({
      ...input,
      status: BaggageStatus.CHECKED_IN,
      passenger,
    });
    return this.baggageRepo.save(baggage);
  }

  async updateStatus(input: UpdateBaggageStatusInput) {
    const baggage = await this.baggageRepo.findOne({
      where: { id: input.id },
      relations: ['passenger'],
    });

    if (!baggage) {
      throw new Error(`Baggage with ID ${input.id} not found`);
    }

    baggage.status = input.status;
    await this.baggageRepo.save(baggage);

    await pubSub.publish('baggageStatusChanged', {
      baggageStatusChanged: {
        ...baggage,
        passengerId: baggage.passenger.id,
      },
    });

    return baggage;
  }
}
