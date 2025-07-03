import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @MinLength(6)
  newPassword: string;

  @Field()
  @MinLength(6)
  confirmNewPassword: string;
}
