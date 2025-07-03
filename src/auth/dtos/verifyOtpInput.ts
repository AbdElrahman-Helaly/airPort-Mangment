import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class VerifyOtpInput {
  @Field()
  code: string;
}
