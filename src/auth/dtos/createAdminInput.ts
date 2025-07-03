import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAdminInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field()
  password: string;
}
