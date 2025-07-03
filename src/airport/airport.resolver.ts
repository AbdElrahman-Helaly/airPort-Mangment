import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GqlAuthGuard } from 'src/auth/jwtModule/jwt.guard';
import { Role } from 'src/users/enums/role.enum';
import { AirportService } from './airport.service';
import { Airport } from './entities/airport.entity';
import { Flight } from 'src/flights/entities/flight.entity';

@Resolver(() => Airport)
export class AirportResolver {
  constructor(private readonly airportService: AirportService) {}

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN)
  @Query(() => [Airport])
  airports() {
    return this.airportService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @Query(() => Airport)
  airport(@Args('id') id: string) {
    return this.airportService.findOne(id);
  }

  /*@ResolveField(() => [Flight])
  flights(@Parent() airport: Airport) {
    return this.airportService.getFlightsForAirport(airport.id);
  }*/
}
