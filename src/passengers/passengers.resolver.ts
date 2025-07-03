import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PassengersService } from './passengers.service';
import { Passenger } from './entities/passenger.entity';
import { CreatePassengerInput } from './dtos/createPassengerInput';
import { UpdatePassengerInput } from './dtos/updatePassengerInput';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { User } from 'src/users/entites/user.entity';
import { GqlAuthGuard } from 'src/auth/jwtModule/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import DataLoader from 'dataloader';

@Resolver(() => Passenger)
export class PassengersResolver {
  constructor(private readonly passengersService: PassengersService) {}

  @UseGuards(GqlAuthGuard)
  @Roles(Role.PASSENGER)
  @Mutation(() => Passenger)
  createPassenger(
    @Args('input') input: CreatePassengerInput,
    @CurrentUser() user: User,
  ) {
    return this.passengersService.create(input, user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Passenger])
  getAllPassengers() {
    return this.passengersService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  @Query(() => Passenger)
  getPassenger(@Args('id') id: string) {
    return this.passengersService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN, Role.PASSENGER)
  @Mutation(() => Passenger)
  updatePassenger(@Args('input') input: UpdatePassengerInput) {
    return this.passengersService.update(input.id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  deletePassenger(@Args('id') id: string) {
    return this.passengersService.delete(id);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.PASSENGER)
  @Query(() => Passenger)
  getProfile(@CurrentUser() user: User) {
    return this.passengersService.getPassengerByUser(user);
  }

  @ResolveField(() => User)
  user(
    @Parent() passenger: Passenger,
    @Context() context: { loaders: { userLoader: DataLoader<string, User> } },
  ) {
    return context.loaders.userLoader.load(passenger.user.id);
  }
}
