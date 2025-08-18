import { Request } from 'express';
import { User } from '../../entities/user.entity';

export interface GqlContext {
  req: Request & { user?: User };
  res: any;
}
