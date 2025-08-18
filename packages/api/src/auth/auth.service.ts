import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { Role } from 'src/entities/enums';
import { OtpService } from '../otp/otp.service';
import { OtpLoginInput } from './dtos/login.input';
import { SignupInput } from './dtos/signup.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  /** Génère access/refresh tokens + user */
  private generateTokens(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
      user,
    };
  }

  /** Login email/password */
  async loginWithEmailPassword(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  /** Signup (email/password ou téléphone) */
  async signup(input: SignupInput) {
    const { email, password, phone, isOtpOnly, role } = input;
    // Vérifie email ou phone déjà existant
    if (email) {
      const existing = await this.usersService.findByEmail(email);
      if (existing) throw new UnauthorizedException('Email already exists');
    }
    if (phone) {
      const existing = await this.usersService.findByPhone(phone);
      if (existing) throw new UnauthorizedException('Phone already exists');
    }

    const user = await this.usersService.create(email, password ?? null, {
      phone,
      isOtpOnly,
      role: role ?? Role.Patient,
    });

    return this.generateTokens(user);
  }

  /** Refresh token */
  refreshToken(user: User) {
    return this.generateTokens(user);
  }

  /** Demander OTP (email ou téléphone) */
  async requestOtp(email?: string, phone?: string) {
    if (email) {
      await this.otpService.generateOtp(email);
      // TODO: envoi email
    }
    if (phone) {
      await this.otpService.generateOtp(phone);
      // TODO: envoi SMS
    }
    return true;
  }

  /** Login ou signup par OTP (email ou téléphone) */
  async loginWithOtp(input: OtpLoginInput) {
    const identifier = input.email ?? input.phone;
    if (!identifier) throw new Error('Email or phone is required');

    const valid = await this.otpService.verifyOtp(identifier, input.otp);
    if (!valid) throw new UnauthorizedException('Invalid OTP');

    let user: User | null = null;
    if (input.email) {
      user = await this.usersService.findByEmail(input.email);
      if (!user) {
        user = await this.usersService.create(input.email, null, {
          isOtpOnly: true,
        });
      }
    } else if (input.phone) {
      user = await this.usersService.findByPhone(input.phone);
      if (!user) {
        user = await this.usersService.create(undefined, null, {
          phone: input.phone,
          isOtpOnly: true,
        });
      }
    }

    return this.generateTokens(user!);
  }
}
