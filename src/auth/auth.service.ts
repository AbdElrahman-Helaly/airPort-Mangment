import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { OTP } from './entites/otp.entity';
import { User } from '../users/entites/user.entity';
import { RegisterUserInput } from './dtos/registerInput';
import { Role } from 'src/users/enums/role.enum';
import { LoginInput } from './dtos/loginInput';
import { LoginResponse } from './dtos/loginResponse';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ResetPasswordInput } from './dtos/resetPasswordInput';
import { RequestOtpInput } from './dtos/sendOtpInput';
import { VerifyOtpInput } from './dtos/verifyOtpInput';
import { CreateAdminInput } from './dtos/createAdminInput';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(OTP)
    private otpRepo: Repository<OTP>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async requestOtp(input: RequestOtpInput) {
    const usertest = await this.usersService.findByEmailOrPhone(
      input.email,
      input.phone,
    );
    if (usertest) throw new BadRequestException('User is Registered.');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpRepo.save({
      email: input.email,
      phone: input.phone,
      code,
      expiresAt,
      type: 'register',
      isVerified: false,
    });

    if (input.email) {
      await this.mailService.sendMail(
        input.email,
        'Your Registration OTP Code',
        `<p>Your OTP code is: <b>${code}</b>. It will expire in 5 minutes.</p>`,
      );
    }

    return 'OTP sent';
  }

  async requestResetPassword(input: RequestOtpInput): Promise<string> {
    const user = await this.usersService.findByEmailOrPhone(
      input.email,
      input.phone,
    );
    if (!user) throw new BadRequestException('User not found');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpRepo.save({
      email: user.email,
      phone: user.phone,
      code,
      expiresAt,
      type: 'forgetPassword',
      isVerified: false,
    });

    if (user.email) {
      await this.mailService.sendMail(
        user.email,
        'Reset Password OTP',
        `<p>Your reset code is <b>${code}</b>. It will expire in 5 minutes.</p>`,
      );
    }

    return 'OTP sent successfully';
  }

  async verifyOtp(input: VerifyOtpInput): Promise<string> {
    const { code } = input;

    const otp = await this.otpRepo.findOne({
      where: { code, isVerified: false },
      order: { expiresAt: 'DESC' },
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired code');
    }

    otp.isVerified = true;
    await this.otpRepo.save(otp);

    return 'OTP verified successfully';
  }

  async register(input: RegisterUserInput): Promise<User> {
    const { firstName, lastName, email, phone, password, confirmPassword } =
      input;

    if (password !== confirmPassword)
      throw new BadRequestException('Passwords do not match');

    const exists = await this.userRepo.findOne({
      where: [{ email }, { phone }],
    });
    if (exists) throw new BadRequestException('Email or phone already exists');

    const hashed = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashed,
      role: Role.PASSENGER,
    });

    return this.userRepo.save(user);
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const { email, phone, password } = input;

    const user = await this.usersService.findByEmailOrPhone(email, phone);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user,
    };
  }

  async resetPassword(input: ResetPasswordInput): Promise<boolean> {
    if (input.newPassword !== input.confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const otp = await this.otpRepo.findOne({
      where: { isVerified: true, type: 'forgetPassword' },
      order: { expiresAt: 'DESC' },
    });

    if (!otp || (!otp.email && !otp.phone)) {
      throw new BadRequestException('No verified request found');
    }

    const user = await this.usersService.findByEmailOrPhone(
      otp.email,
      otp.phone,
    );
    if (!user) throw new BadRequestException('User not found');

    user.password = await bcrypt.hash(input.newPassword, 10);
    await this.userRepo.save(user);

    otp.isVerified = false;
    await this.otpRepo.save(otp);

    return true;
  }

  async createAdmin(input: CreateAdminInput): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: [{ email: input.email }, { phone: input.phone }],
    });
    if (existing) throw new ForbiddenException('Email or phone already in use');

    const password = await bcrypt.hash(input.password, 10);

    const admin = this.userRepo.create({
      ...input,
      password,
      role: Role.ADMIN,
    });

    return this.userRepo.save(admin);
  }

  async findAllAdmins(): Promise<User[]> {
    return this.userRepo.find({ where: { role: Role.ADMIN } });
  }
  /*
  async createSuperAdmin(): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: [{ email: 'Abdelrahman@Jda.com' }],
    });
    if (existing) throw new BadRequestException('Already exists');

    const hashed = await bcrypt.hash('Ahmed@1234', 10);

    const admin = this.userRepo.create({
      email: 'Abdelrahman@Jda.com',
      phone: '0120456789',
      password: hashed,
      firstName: 'Abdelrahman',
      lastName: 'Helaly',
      role: Role.SUPER_ADMIN,
    });

    return this.userRepo.save(admin);
  }*/
}
