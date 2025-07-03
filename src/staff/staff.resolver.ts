import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
} from '@nestjs/graphql';
import { StaffService } from './staff.service';
import { CreateStaffInput } from './dtos/createStaff.Input';
import { AssignFlightsInput } from './dtos/assignFlights';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/jwtModule/jwt.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { Staff } from './entities/staff.Entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { User } from 'src/users/entites/user.entity';

@Resolver(() => Staff)
@UseGuards(GqlAuthGuard, RolesGuard)
export class StaffResolver {
  constructor(private readonly staffService: StaffService) {}

  @Query(() => [Staff])
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getAllStaff() {
    return this.staffService.getAllStaff();
  }

  @Mutation(() => Staff)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  createStaff(@Args('input') input: CreateStaffInput) {
    return this.staffService.createStaff(input);
  }

  @Mutation(() => Staff)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  assignStaffToFlight(@Args('input') input: AssignFlightsInput) {
    return this.staffService.assignStaffToFlight(input);
  }

  @Mutation(() => Staff)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  updateStaff(@Args('id') id: string, @Args('input') input: CreateStaffInput) {
    return this.staffService.updateStaff(id, input);
  }

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  deleteStaff(@Args('id') id: string) {
    return this.staffService.deleteStaff(id);
  }

  @ResolveField(() => User)
  user(@Parent() staff: Staff, @Context() context: any) {
    return context.loaders.userLoader.load(staff.user.id);
  }
}
