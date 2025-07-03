import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RequestOtpInput } from './dtos/sendOtpInput';
import { VerifyOtpInput } from './dtos/verifyOtpInput';
import { RegisterUserInput } from './dtos/registerInput';
import { User } from '../users/entites/user.entity';
import { LoginResponse } from './dtos/loginResponse';
import { LoginInput } from './dtos/loginInput';
import { GqlAuthGuard } from './jwtModule/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { ResetPasswordInput } from './dtos/resetPasswordInput';
import { RolesGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateAdminInput } from './dtos/createAdminInput';
import { Role } from 'src/users/enums/role.enum';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Query(() => String)
  hello() {
    return 'Hello World!';
  }

  @Mutation(() => String)
  requestOtp(@Args('input') input: RequestOtpInput) {
    return this.authService.requestOtp(input);
  }

  @Mutation(() => Boolean)
  verifyOtp(@Args('input') input: VerifyOtpInput) {
    return this.authService.verifyOtp(input);
  }

  @Mutation(() => User)
  register(@Args('input') input: RegisterUserInput): Promise<User> {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponse)
  login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    return this.authService.login(input);
  }
  @Query(() => String)
  @UseGuards(GqlAuthGuard)
  protectedData() {
    return 'This data is protected and only accessible with a valid token';
  }

  @Mutation(() => String)
  requestResetPassword(@Args('input') input: RequestOtpInput): Promise<string> {
    return this.authService.requestResetPassword(input);
  }

  @Mutation(() => String)
  verifyResetOtp(@Args('input') input: VerifyOtpInput): Promise<string> {
    return this.authService.verifyOtp(input);
  }

  @Mutation(() => Boolean)
  resetPassword(@Args('input') input: ResetPasswordInput): Promise<boolean> {
    return this.authService.resetPassword(input);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  createAdmin(@Args('input') input: CreateAdminInput) {
    return this.authService.createAdmin(input);
  }

  @Query(() => [User])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  findAllAdmins() {
    return this.authService.findAllAdmins();
  }
  /*
  @Mutation(() => User)
  createSuperAdmin(): Promise<User> {
    return this.authService.createSuperAdmin();
  }*/
}
