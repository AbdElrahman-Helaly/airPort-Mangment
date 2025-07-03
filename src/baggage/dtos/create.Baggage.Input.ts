import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBaggageInput {
  @Field()
  description: string;
}
