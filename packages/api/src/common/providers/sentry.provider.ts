import * as Sentry from '@sentry/browser';

export const initSentry = () => {
  if (!process.env.SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
  });

  console.log('[Sentry] Initialized');
  return Sentry;
};
