/** Lightweight HTTP helpers (stubs — Day 4). */

import { AppError } from '../errors';

export type HttpJsonOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: Record<string, string>;
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
      throw new AppError('SERVER', `HTTP ${response.status}`, {
        retryable: response.status >= 500,
      });
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AppError('TIMEOUT', 'Request timed out or was cancelled', {
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
