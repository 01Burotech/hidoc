import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPayload } from './dtos/auth-payload.type';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { GqlContext } from 'src/common/decorators/gql-context.interface';
import { LoginInput, OtpLoginInput } from './dtos/login.input';
import { SignupInput } from './dtos/signup.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /** Retourne l’utilisateur courant */
  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }

  /** Login classique email/password */
  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.authService.loginWithEmailPassword(input.email, input.password);
  }

  /** Signup (email/password ou téléphone) */
  @Mutation(() => AuthPayload)
  async signup(@Args('input') input: SignupInput) {
    return this.authService.signup(input);
  }

  /** Rafraîchir access/refresh token */
  @Mutation(() => AuthPayload)
  refreshToken(@Context() ctx: GqlContext) {
    const user = ctx.req.user;
    if (!user) throw new Error('No user in context');
    return this.authService.refreshToken(user);
  }

  /** Demander un OTP (email ou téléphone) */
  @Mutation(() => Boolean)
  async requestOtp(
    @Args('email', { nullable: true }) email?: string,
    @Args('phone', { nullable: true }) phone?: string,
  ) {
    if (!email && !phone) throw new Error('Email or phone is required');
    return this.authService.requestOtp(email, phone);
  }

  /** Login/signup avec OTP (email ou téléphone) */
  @Mutation(() => AuthPayload)
  async loginWithOtp(@Args('input') input: OtpLoginInput) {
    return this.authService.loginWithOtp(input);
  }
}
