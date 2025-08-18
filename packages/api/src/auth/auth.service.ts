import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { OtpService } from '../otp/otp.service';
import { Role } from 'src/entities/enums';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.passwordHash) return null;
    const valid = await bcrypt.compare(pass, user.passwordHash);
    return valid ? user : null;
  }

  login(user: User) {
    const payload = { sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
      }),
      user,
    };
  }

  async signup(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already exists');
    const user = await this.usersService.create(email, password);
    return this.login(user);
  }

  refreshToken(user: User) {
    return this.login(user);
  }

  async requestOtp(email: string) {
    const otp = await this.otpService.generateOtp(email);
    return { success: true, otp };
  }

  async loginWithOtp(email: string, otp: string) {
    const valid = await this.otpService.verifyOtp(email, otp);
    if (!valid) throw new UnauthorizedException('Invalid OTP');
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      user = await this.usersService.create(email, null);
    }
    return this.login(user);
  }

  /** Login / Signup par OTP téléphone */
  async loginWithPhoneOtp(phone: string, otp: string) {
    const valid = await this.otpService.verifyOtp(phone, otp);
    if (!valid) throw new UnauthorizedException('Invalid OTP');
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.create(undefined, null, {
        phone,
        isOtpOnly: true,
      });
    }
    return this.login(user);
  }

  async requestOtpPhone(phone: string) {
    const otp = await this.otpService.generateOtp(phone);
    return { success: true, otp }; // envoyer SMS via provider
  }

  async createUser(options: {
    email?: string;
    password?: string | null;
    phone?: string;
    isOtpOnly?: boolean;
    role?: Role;
  }) {
    const { email, password, phone, isOtpOnly, role } = options;

    // Vérifie si l'email existe déjà
    if (email) {
      const existing = await this.usersService.findByEmail(email);
      if (existing) throw new Error('Email already exists');
    }

    return this.usersService.create(email, password, {
      phone,
      isOtpOnly,
      role,
    });
  }
}
