import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignFlightsInput {
  @Field()
  @IsUUID()
  staffId: string;

  @Field()
  @IsUUID()
  flightId: string;
}
