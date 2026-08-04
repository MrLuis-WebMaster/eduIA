import { AppError } from '@/shared';

import type { TutorSendErrorKind } from './useTutorSession';

export function classifyTutorSendError(
  error: unknown,
  isOffline: boolean,
): TutorSendErrorKind | null {
  if (!error) return null;
  if (error instanceof AppError && error.code === 'CANCELLED') {
    return 'cancelled';
  }
  if (isOffline) return 'offline';
  if (error instanceof AppError) {
    switch (error.code) {
      case 'TIMEOUT':
        return 'timeout';
      case 'NETWORK':
        return 'network';
      case 'VALIDATION':
        return 'validation';
      case 'SERVER':
        return 'server';
      default:
        return 'unknown';
    }
  }
  return 'unknown';
}

export function tutorSendErrorMessage(
  error: unknown,
  isOffline: boolean,
): string | null {
  if (!error) return null;
  if (error instanceof AppError && error.code === 'CANCELLED') {
    return null;
  }
  if (isOffline) {
    return 'Sin conexión. Revisa tu red e inténtalo de nuevo.';
  }
  if (error instanceof AppError) {
    switch (error.code) {
      case 'TIMEOUT':
        return 'La respuesta tardó demasiado. Puedes reintentar.';
      case 'NETWORK':
        return 'No hay conexión con el tutor. Revisa la red o la API.';
      default:
        return error.message;
    }
  }
  if (error instanceof Error) return error.message;
  return 'No se pudo enviar el mensaje';
}
