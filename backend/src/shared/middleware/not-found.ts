import type { Request, Response } from 'express';

import { AppError, toNormalizedError } from '../errors/app-error.js';

export function notFoundHandler(req: Request, res: Response): void {
  const error = AppError.notFound();
  res
    .status(error.statusCode)
    .json(toNormalizedError(error, req.requestId ?? 'unknown'));
}
