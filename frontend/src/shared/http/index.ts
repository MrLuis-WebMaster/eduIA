/** Lightweight HTTP helpers for JSON APIs. */

import { AppError, type AppErrorCode } from '../errors';

export type HttpJsonOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: Record<string, string>;
};

type NormalizedApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
    retryable?: boolean;
    requestId?: string;
  };
};

export async function httpJson<T>(
  url: string,
  options: HttpJsonOptions = {},
): Promise<T> {
  const { method = 'GET', body, signal, timeoutMs = 20_000, headers } = options;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body != null ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body != null ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw await toHttpAppError(response);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AppError) throw error;
    // RN fetch often rejects aborted requests as a generic network TypeError
    // instead of AbortError — trust the caller's signal first.
    if (signal?.aborted === true) {
      throw new AppError('CANCELLED', 'Request was cancelled', {
        retryable: true,
        cause: error,
      });
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AppError('TIMEOUT', 'Request timed out', {
        retryable: true,
        cause: error,
      });
    }
    throw new AppError('NETWORK', 'Network request failed', {
      retryable: true,
      cause: error,
    });
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', onAbort);
  }
}

async function toHttpAppError(response: Response): Promise<AppError> {
  let body: NormalizedApiErrorBody | null = null;
  try {
    body = (await response.json()) as NormalizedApiErrorBody;
  } catch {
    body = null;
  }

  const apiError = body?.error;
  const message =
    apiError?.message?.trim() ||
    `HTTP ${response.status}`;
  const retryable =
    apiError?.retryable ??
    (response.status === 429 || response.status >= 500);
  const code = mapApiErrorCode(apiError?.code, response.status);

  return new AppError(code, message, {
    retryable,
    requestId: apiError?.requestId,
  });
}

function mapApiErrorCode(
  apiCode: string | undefined,
  status: number,
): AppErrorCode {
  switch (apiCode) {
    case 'VALIDATION_ERROR':
      return 'VALIDATION';
    case 'AI_PROVIDER_TIMEOUT':
      return 'TIMEOUT';
    case 'RATE_LIMIT_EXCEEDED':
    case 'AI_PROVIDER_ERROR':
    case 'INTERNAL_ERROR':
    case 'CONFIGURATION_ERROR':
    case 'NOT_FOUND':
      return 'SERVER';
    default:
      if (status === 400 || status === 422) return 'VALIDATION';
      if (status === 408 || status === 504) return 'TIMEOUT';
      return 'SERVER';
  }
}
