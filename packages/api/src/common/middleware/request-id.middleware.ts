import { Injectable, NestMiddleware } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as Sentry from '@sentry/browser';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const requestId = uuidv4();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);

    // Ajoute requestId à Sentry pour corrélation
    Sentry.withScope((scope) => {
      scope.setTag('requestId', requestId);
      next();
    });
  }
}
