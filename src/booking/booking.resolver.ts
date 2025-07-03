import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Context,
  Parent,
} from '@nestjs/graphql';
import { Booking } from './entities/booking.entity';
import { BookingService } from './booking.service';
import { CreateBookingInput } from './dtos/createBookingInput';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { User } from 'src/users/entites/user.entity';
import { CurrentUser } from 'src/auth/decorators/currentUser.decorator';
import { GqlAuthGuard } from 'src/auth/jwtModule/jwt.guard';
import { Passenger } from 'src/passengers/entities/passenger.entity';
import { Flight } from 'src/flights/entities/flight.entity';

@Resolver(() => Booking)
@UseGuards(GqlAuthGuard)
@Roles(Role.PASSENGER)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Mutation(() => Booking)
  createBooking(
    @Args('input') input: CreateBookingInput,
    @CurrentUser() user: User,
  ) {
    return this.bookingService.create(input, user.id);
  }

  @Query(() => [Booking])
  getMyBookings(@CurrentUser() user: User) {
    return this.bookingService.getMyBookings(user.id);
  }

  @Query(() => [String])
  getBookedSeats(@Args('flightId') flightId: string) {
    return this.bookingService.getBookedSeats(flightId);
  }

  @Mutation(() => Boolean)
  cancelBooking(@Args('id') bookingId: string, @CurrentUser() user: User) {
    return this.bookingService.cancelBooking(bookingId, user.id);
  }

  @ResolveField(() => Passenger)
  passenger(@Parent() booking: Booking, @Context() context: any) {
    return context.loaders.passengerLoader.load(booking.passenger.id);
  }
  @ResolveField(() => Flight)
  flight(@Parent() booking: Booking, @Context() context: any) {
    return context.loaders.flightLoader.load(booking.flight.id);
  }
}
