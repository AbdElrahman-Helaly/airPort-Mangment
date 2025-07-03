import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateAirportInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
