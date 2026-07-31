import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';

import { healthRouter } from './modules/health/index.js';
import { composeTutoring } from './modules/tutoring/index.js';
import type { Env } from './shared/config/env.js';
import { loadEnv } from './shared/config/env.js';
import { logger } from './shared/logging/logger.js';
import { errorHandler } from './shared/middleware/error-handler.js';
import { notFoundHandler } from './shared/middleware/not-found.js';
import { requestIdMiddleware } from './shared/middleware/request-id.js';

export interface CreateAppOptions {
  env?: Env;
}

export function createApp(options: CreateAppOptions = {}) {
  const env = options.env ?? loadEnv();
  const tutoring = composeTutoring(env);

  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
    }),
  );
  app.use(express.json({ limit: '32kb' }));
  app.use(requestIdMiddleware);
  app.use(
    pinoHttp({
      logger,
      customProps: (req) => ({
        requestId: (req as express.Request).requestId,
      }),
      autoLogging: env.NODE_ENV !== 'test',
    }),
  );

  app.use('/api/v1', healthRouter);
  app.use('/api/v1', tutoring.router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
