import { InputType, Field, ID } from '@nestjs/graphql';
import { BaggageStatus } from '../enums/baggageStatus';

@InputType()
export class UpdateBaggageStatusInput {
  @Field(() => ID)
  id: string;

  @Field(() => BaggageStatus)
  status: BaggageStatus;
}
