import { ErrorCodes, type ErrorCode } from './error-codes.js';

/**
 * Maps application error codes to HTTP status at the transport edge.
 * Use cases and adapters throw AppError by code only — never pick status inline.
 */
export const HttpStatusByErrorCode: Record<ErrorCode, number> = {
  [ErrorCodes.VALIDATION_ERROR]: 400,
  [ErrorCodes.AI_PROVIDER_ERROR]: 502,
  [ErrorCodes.AI_PROVIDER_TIMEOUT]: 504,
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 429,
  [ErrorCodes.NOT_FOUND]: 404,
  [ErrorCodes.INTERNAL_ERROR]: 500,
  [ErrorCodes.CONFIGURATION_ERROR]: 500,
};

export function httpStatusForErrorCode(code: ErrorCode): number {
  return HttpStatusByErrorCode[code];
}
