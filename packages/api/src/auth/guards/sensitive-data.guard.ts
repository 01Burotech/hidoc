import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlContext } from 'src/common/decorators/gql-context.interface';
import { PatientsService } from 'src/patient/patients.service';

@Injectable()
export class SensitiveDataGuard implements CanActivate {
  constructor(
    private consentService: PatientsService,
    private scope: string,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const gqlContext = ctx.getContext<GqlContext>();
    const user = gqlContext.req.user;
    if (!user) throw new ForbiddenException();
    const has = await this.consentService.hasConsent(user.id, this.scope);
    if (!has)
      throw new ForbiddenException(`Consent required for scope: ${this.scope}`);
    return true;
  }
}
