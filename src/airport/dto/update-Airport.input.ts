import { CreateAirportInput } from './create-Airport.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAirportInput extends PartialType(CreateAirportInput) {
  @Field(() => Int)
  id: number;
}
