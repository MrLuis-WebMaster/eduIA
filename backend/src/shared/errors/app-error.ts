import { ErrorCodes, type ErrorCode } from './error-codes.js';
import { httpStatusForErrorCode } from './http-status.js';

/**
 * Application error — identified by code + retryability.
 * HTTP status is derived at the edge via {@link httpStatusForErrorCode}.
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly retryable: boolean;

  constructor(code: ErrorCode, message: string, retryable: boolean) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.retryable = retryable;
  }

  /** Transport mapping — prefer reading this only in HTTP middleware. */
  get statusCode(): number {
    return httpStatusForErrorCode(this.code);
  }

  static validation(message: string): AppError {
    return new AppError(ErrorCodes.VALIDATION_ERROR, message, false);
  }

  static aiProvider(message: string, retryable = true): AppError {
    return new AppError(ErrorCodes.AI_PROVIDER_ERROR, message, retryable);
  }

  static aiTimeout(message = 'AI provider request timed out'): AppError {
    return new AppError(ErrorCodes.AI_PROVIDER_TIMEOUT, message, true);
  }

  static rateLimit(
    message = 'Too many requests. Please try again later.',
  ): AppError {
    return new AppError(ErrorCodes.RATE_LIMIT_EXCEEDED, message, true);
  }

  static notFound(message = 'Route not found'): AppError {
    return new AppError(ErrorCodes.NOT_FOUND, message, false);
  }

  static internal(message = 'Internal server error'): AppError {
    return new AppError(ErrorCodes.INTERNAL_ERROR, message, true);
  }

  static configuration(message: string): AppError {
    return new AppError(ErrorCodes.CONFIGURATION_ERROR, message, false);
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
