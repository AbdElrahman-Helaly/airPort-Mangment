import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreatePassengerInput } from './createPassengerInput';

@InputType()
export class UpdatePassengerInput extends PartialType(CreatePassengerInput) {
  @Field()
  id: string;
}
