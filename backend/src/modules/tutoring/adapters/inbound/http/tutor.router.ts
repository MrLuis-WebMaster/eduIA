import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { AppError, toNormalizedError } from '../../../../../shared/errors/app-error.js';
import type { GenerateTutorResponse } from '../../../application/use-cases/generate-tutor-response.js';
import { createTutorController } from './tutor.controller.js';

export interface TutorRouterOptions {
  useCase: GenerateTutorResponse;
  rateLimitWindowMs: number;
  rateLimitMax: number;
}

export function createTutorRouter(options: TutorRouterOptions): Router {
  const router = Router();
  const controller = createTutorController(options.useCase);

  const tutorRateLimit = rateLimit({
    windowMs: options.rateLimitWindowMs,
    max: options.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const error = AppError.rateLimit();
      res
        .status(error.statusCode)
        .json(toNormalizedError(error, req.requestId ?? 'unknown'));
    },
  });

  router.post('/tutor/messages', tutorRateLimit, (req, res, next) => {
    void controller.postMessage(req, res, next);
  });

  return router;
}
