import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entites/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findByEmailOrPhone(
    email?: string,
    phone?: string,
  ): Promise<User | null> {
    if (!email && !phone) return null;

    if (email && phone) {
      return this.userRepo.findOne({
        where: [{ email }, { phone }],
      });
    }
    return this.userRepo.findOne({
      where: email ? { email } : { phone },
    });
  }
}
