import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Flight } from './entities/flight.entity';
import { PaginationInput } from './dtos/paginationInput';
import { FlightsService } from './flights.service';
import { FlightFilterInput } from './dtos/filterFlightInput';
import { CreateFlightInput } from './dtos/createFlightInput';
import { UpdateFlightInput } from './dtos/updateFlightInput';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { pubSub } from 'src/pubsub';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwtModule/jwt.guard';

@Resolver(() => Flight)
export class FlightsResolver {
  constructor(private readonly flightService: FlightsService) {}

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Flight)
  async createFlight(@Args('input') input: CreateFlightInput): Promise<Flight> {
    return this.flightService.createFlight(input);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Flight)
  async updateFlight(@Args('input') input: UpdateFlightInput): Promise<Flight> {
    return this.flightService.updateFlight(input);
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  @Mutation(() => Boolean)
  async deleteFlight(@Args('id') id: string): Promise<boolean> {
    return this.flightService.deleteFlight(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Flight])
  async flights(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('filter', { nullable: true }) filter?: FlightFilterInput,
  ): Promise<Flight[]> {
    const { flights } = await this.flightService.getFlights(
      pagination || { page: 1, limit: 10 },
      filter,
    );
    return flights;
  }

  @Subscription(() => Flight, {
    filter: (payload, variables) => {
      return payload.flightStatusUpdated.id === variables.flightId;
    },
  })
  flightStatusUpdated(@Args('flightId') flightId: string) {
    return pubSub.asyncIterator('flightStatusUpdated');
  }
}
