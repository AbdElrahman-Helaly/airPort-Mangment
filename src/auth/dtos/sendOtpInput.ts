import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsPhoneNumber, ValidateIf } from 'class-validator';

@InputType()
export class RequestOtpInput {
  @Field({ nullable: true })
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('EG')
  phone?: string;
}
