import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Request } from 'express';

interface JwtPayload {
  sub: string; // l'ID de l'utilisateur
  role: string; // son rôle
}

interface RequestWithCookies extends Request {
  cookies: Record<string, string>; // typage strict des cookies
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    config: ConfigService,
    private usersService: UsersService,
  ) {
    const refreshSecret = config.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET must be defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: RequestWithCookies) => req?.cookies?.refreshToken,
      ]),
      secretOrKey: refreshSecret,
    });
  }

  async validate(payload: JwtPayload) {
    return this.usersService.findById(payload.sub);
  }
}
