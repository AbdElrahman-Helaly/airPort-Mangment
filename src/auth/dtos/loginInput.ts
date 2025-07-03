import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsPhoneNumber,
  ValidateIf,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  @ValidateIf((o) => !o.phone)
  @IsEmail({}, { message: 'Email must be valid' })
  email?: string;

  @Field({ nullable: true })
  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('EG', { message: 'Phone must be a valid Egyptian number' })
  phone?: string;

  @Field()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
