import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateFlightInput } from './createFlightInput';

@InputType()
export class UpdateFlightInput extends PartialType(CreateFlightInput) {
  @Field()
  flightId: string;
}
