import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePassengerInput {
  @Field()
  fullName: string;

  @Field()
  passportNumber: string;

  @Field()
  nationality: string;
}
