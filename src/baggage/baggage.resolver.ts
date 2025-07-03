import {
  Resolver,
  Mutation,
  Args,
  Subscription,
  Context,
} from '@nestjs/graphql';
import { BaggageService } from './baggage.service';

import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwtModule/jwt.guard';
import { User } from 'src/users/entites/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { PubSub } from 'graphql-subscriptions';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBaggageInput } from './dtos/create.Baggage.Input';
import { UpdateBaggageStatusInput } from './dtos/update.Baggage.input';
import { Baggage } from './entites/baggage.entity';
import { pubSub } from 'src/pubsub';
import { PassengersService } from 'src/passengers/passengers.service';

@Resolver(() => Baggage)
export class BaggageResolver {
  constructor(
    private readonly baggageService: BaggageService,
    @InjectRepository(Passenger)
    private passengerRepo: PassengersService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Roles(Role.PASSENGER)
  @Mutation(() => Baggage)
  async createBaggage(
    @Args('input') input: CreateBaggageInput,
    @CurrentUser() user: User,
  ) {
    const passenger = await this.passengerRepo.findOne(user.id);

    return this.baggageService.create(input, passenger);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Baggage)
  updateBaggageStatus(@Args('input') input: UpdateBaggageStatusInput) {
    return this.baggageService.updateStatus(input);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.PASSENGER)
  @Subscription(() => Baggage, {
    resolve: (payload) => payload.baggageUpdated,
    filter: (payload, _, context) => {
      return (
        payload.baggageUpdated.passenger.id === context.req.user.passengerId
      );
    },
  })
  @Subscription(() => Baggage, {
    filter: (payload, variables, context) => {
      return payload.baggageStatusChanged.passengerId === context.req.user.id;
    },
  })
  baggageStatusChanged() {
    return pubSub.asyncIterator('baggageStatusChanged');
  }
}
