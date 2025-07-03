import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field(() => ID)
  flightId: string;

  @Field()
  seatNumber: string;
}
