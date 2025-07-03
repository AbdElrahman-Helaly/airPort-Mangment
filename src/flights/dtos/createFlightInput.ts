import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
import { FlightStatus } from '../enums/flightsStatus';

@InputType()
export class CreateFlightInput {
  @Field()
  @IsNotEmpty()
  flightNumber: string;

  @Field()
  @IsNotEmpty()
  departureAirport: string;

  @Field()
  @IsNotEmpty()
  destinationAirport: string;

  @Field()
  @IsDateString()
  @Field(() => GraphQLISODateTime)
  departureTime: string;

  @Field()
  @IsDateString()
  @Field(() => GraphQLISODateTime)
  arrivalTime: string;

  @Field()
  @IsNotEmpty()
  airline: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  availableSeats: number;

  @Field()
  airportId: string;

  @Field(() => FlightStatus, { nullable: true })
  status?: FlightStatus;
}
