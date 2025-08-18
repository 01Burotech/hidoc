import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, OtpLoginInput } from './dtos/login.input';
import { SignupInput } from './dtos/signup.input';
import { AuthPayload } from './dtos/auth-payload.type';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { GqlContext } from 'src/common/decorators/gql-context.interface';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @Mutation(() => AuthPayload)
  async signup(@Args('input') input: SignupInput) {
    const { email, password, phone, isOtpOnly, role } = input;

    const user = await this.authService.createUser({
      email,
      password: password ?? null,
      phone,
      isOtpOnly,
      role,
    });

    return this.authService.login(user);
  }

  @Mutation(() => AuthPayload)
  refreshToken(@Context() ctx: GqlContext) {
    const user = ctx.req.user;
    if (!user) throw new Error('No user in context');
    return this.authService.refreshToken(user);
  }

  @Mutation(() => Boolean)
  async requestOtp(
    @Args('email', { nullable: true }) email?: string,
    @Args('phone', { nullable: true }) phone?: string,
  ) {
    if (email) await this.authService.requestOtp(email);
    if (phone) await this.authService.requestOtp(phone);
    return true;
  }

  @Mutation(() => AuthPayload)
  async loginWithOtp(@Args('input') input: OtpLoginInput) {
    if (!input.email && !input.phone)
      throw new Error('Email or phone is required');
    const identifier = input.email ?? input.phone!;
    return this.authService.loginWithOtp(identifier, input.otp);
  }
}
