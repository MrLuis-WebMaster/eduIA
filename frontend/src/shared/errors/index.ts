/** Normalized client errors (stubs — expanded Day 5). */

export type AppErrorCode =
  | 'NETWORK'
  | 'TIMEOUT'
  | 'CANCELLED'
  | 'VALIDATION'
  | 'SERVER'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly retryable: boolean;
  readonly requestId?: string;

  constructor(
    code: AppErrorCode,
    message: string,
    options?: { retryable?: boolean; requestId?: string; cause?: unknown },
  ) {
    super(message, options?.cause ? { cause: options.cause } : undefined);
    this.name = 'AppError';
    this.code = code;
    this.retryable = options?.retryable ?? false;
    this.requestId = options?.requestId;
  }
}
