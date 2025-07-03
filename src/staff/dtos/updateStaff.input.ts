import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateStaffInput } from './createStaff.Input';

@InputType()
export class UpdateStaffInput extends PartialType(CreateStaffInput) {}
