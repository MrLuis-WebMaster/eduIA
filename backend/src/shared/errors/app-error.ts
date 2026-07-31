import { ErrorCodes, type ErrorCode } from './error-codes.js';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;
  readonly retryable: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode: number,
    retryable: boolean,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
  }

  static validation(message: string): AppError {
    return new AppError(ErrorCodes.VALIDATION_ERROR, message, 400, false);
  }

  static aiProvider(message: string, retryable = true): AppError {
    return new AppError(ErrorCodes.AI_PROVIDER_ERROR, message, 502, retryable);
  }

  static aiTimeout(message = 'AI provider request timed out'): AppError {
    return new AppError(ErrorCodes.AI_PROVIDER_TIMEOUT, message, 504, true);
  }

  static rateLimit(message = 'Too many requests. Please try again later.'): AppError {
    return new AppError(ErrorCodes.RATE_LIMIT_EXCEEDED, message, 429, true);
  }

  static notFound(message = 'Route not found'): AppError {
    return new AppError(ErrorCodes.NOT_FOUND, message, 404, false);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(ErrorCodes.INTERNAL_ERROR, message, 500, true);
  }

  static configuration(message: string): AppError {
    return new AppError(ErrorCodes.CONFIGURATION_ERROR, message, 500, false);
  }
}

export interface NormalizedErrorBody {
  error: {
    code: ErrorCode;
    message: string;
    retryable: boolean;
    requestId: string;
  };
}

export function toNormalizedError(
  error: AppError,
  requestId: string,
): NormalizedErrorBody {
  return {
    error: {
      code: error.code,
      message: error.message,
      retryable: error.retryable,
      requestId,
    },
  };
}
