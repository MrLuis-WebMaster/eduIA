import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError, toNormalizedError } from '../errors/app-error.js';
import { logger } from '../logging/logger.js';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId = req.requestId ?? 'unknown';

  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, requestId, code: err.code }, err.message);
    } else {
      logger.warn({ err, requestId, code: err.code }, err.message);
    }

    res.status(err.statusCode).json(toNormalizedError(err, requestId));
    return;
  }

  if (err instanceof ZodError) {
    const message = err.issues
      .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
      .join('; ');
    const validationError = AppError.validation(message);
    logger.warn({ err, requestId }, validationError.message);
    res
      .status(validationError.statusCode)
      .json(toNormalizedError(validationError, requestId));
    return;
  }

  logger.error({ err, requestId }, 'Unhandled error');
  const internal = AppError.internal();
  res.status(internal.statusCode).json(toNormalizedError(internal, requestId));
}
