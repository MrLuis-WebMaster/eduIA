import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { healthRouter } from './modules/health/index.js';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? '*',
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.use('/api/v1', healthRouter);

  app.use((_req, res) => {
    res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
        retryable: false,
      },
    });
  });

  return app;
}
