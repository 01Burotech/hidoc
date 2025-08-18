import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { Role } from '../entities/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private UsersRepository: Repository<User>,
  ) {}

  findById(id: string) {
    return this.UsersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.UsersRepository.findOne({ where: { email } });
  }

  findByPhone(phone: string) {
    return this.UsersRepository.findOne({ where: { phone } });
  }

  findAll(): Promise<User[]> {
    return this.UsersRepository.find();
  }

  async create(
    email?: string, // rendu optionnel
    password?: string | null,
    options?: { phone?: string; isOtpOnly?: boolean; role?: Role },
  ) {
    const user = this.UsersRepository.create({
      email, // email peut être undefined
      passwordHash: password ? await bcrypt.hash(password, 10) : undefined,
      ...options,
    });
    return this.UsersRepository.save(user);
  }
}
