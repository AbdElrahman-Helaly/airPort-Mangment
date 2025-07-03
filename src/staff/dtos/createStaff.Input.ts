import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { StaffRole } from '../enums/staffEnum';

@InputType()
export class CreateStaffInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  employeeId: string;

  @Field(() => StaffRole)
  @IsEnum(StaffRole)
  role: StaffRole;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(6)
  password: string;
}
