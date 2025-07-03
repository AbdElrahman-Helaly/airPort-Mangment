import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsDateString } from 'class-validator';

@InputType()
export class FlightFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  departureTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Airport?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  airline?: string;
}
