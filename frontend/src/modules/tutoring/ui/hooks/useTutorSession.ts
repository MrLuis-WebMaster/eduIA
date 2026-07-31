import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

import { getDependencies } from '@/bootstrap';
import { AppError, getAppConfig, httpJson } from '@/shared';

import {
  createEmptySession,
  type Difficulty,
  type Subject,
  type TutorSession,
  type UserRole,
} from '../../domain';

export const TUTOR_SESSION_QUERY_KEY = ['tutoring', 'session'] as const;

export type TutorSendErrorKind =
  | 'timeout'
  | 'cancelled'
  | 'offline'
  | 'network'
  | 'validation'
  | 'server'
  | 'unknown';

export function useTutorSession(
  userRole: UserRole = 'student',
  preferredLevel: Difficulty = 'basic',
) {
  const queryClient = useQueryClient();
  const tutoring = getDependencies().tutoring;
  const abortRef = useRef<AbortController | null>(null);
  const lastFailedMessageRef = useRef<string | null>(null);

  const [subject, setSubject] = useState<Subject>('math');
  const [difficulty, setDifficulty] = useState<Difficulty>(preferredLevel);
  const [draft, setDraft] = useState('');
  const [hydrated, setHydrated] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    });
    return unsubscribe;
  }, []);

  // Soft health probe when NetInfo says reachable but API may be down.
  useEffect(() => {
    if (getAppConfig().useFakeTutor) return;

    let cancelled = false;
    const probe = async () => {
      try {
        const { apiUrl } = getAppConfig();
        await httpJson(`${apiUrl.replace(/\/+$/, '')}/api/v1/health`, {
          method: 'GET',
          timeoutMs: 4_000,
        });
        if (!cancelled) setIsOffline(false);
      } catch {
        // Keep NetInfo-driven offline flag; only mark offline on hard network loss.
      }
    };

    void probe();
    return () => {
      cancelled = true;
    };
  }, []);

  const sessionQuery = useQuery({
    queryKey: TUTOR_SESSION_QUERY_KEY,
    queryFn: async (): Promise<TutorSession> => {
      const existing = await tutoring.loadConversation();
      if (existing) return existing;
      const fresh = createEmptySession(subject, difficulty);
      await tutoring.conversationRepository.save(fresh);
      return fresh;
    },
  });

  const session = sessionQuery.data;

  useEffect(() => {
    if (!session || hydrated) return;
    setSubject(session.subject);
    setDifficulty(session.difficulty);
    setHydrated(true);
  }, [session, hydrated]);

  useEffect(() => {
    if (!hydrated && !session) {
      setDifficulty(preferredLevel);
    }
  }, [preferredLevel, hydrated, session]);

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const current =
        queryClient.getQueryData<TutorSession>(TUTOR_SESSION_QUERY_KEY) ??
        session ??
        createEmptySession(subject, difficulty);

      try {
        return await tutoring.sendMessage({
          message,
          subject,
          difficulty,
          userRole,
          session: {
            ...current,
            subject,
            difficulty,
          },
          signal: controller.signal,
        });
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    onSuccess: (outcome) => {
      queryClient.setQueryData(TUTOR_SESSION_QUERY_KEY, outcome.session);
      setDraft('');
      lastFailedMessageRef.current = null;
    },
    onError: (error, message) => {
      if (error instanceof AppError && error.code === 'CANCELLED') {
        lastFailedMessageRef.current = null;
        return;
      }
      lastFailedMessageRef.current = message;
    },
  });

  const newSessionMutation = useMutation({
    mutationFn: async () =>
      tutoring.startNewSession({ subject, difficulty }),
    onSuccess: (fresh) => {
      queryClient.setQueryData(TUTOR_SESSION_QUERY_KEY, fresh);
      setDraft('');
      lastFailedMessageRef.current = null;
      sendMutation.reset();
    },
  });

  const sendErrorKind = useMemo((): TutorSendErrorKind | null => {
    const err = sendMutation.error;
    if (!err) return null;
    if (isOffline) return 'offline';
    if (err instanceof AppError) {
      switch (err.code) {
        case 'TIMEOUT':
          return 'timeout';
        case 'CANCELLED':
          return 'cancelled';
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
  }, [sendMutation.error, isOffline]);

  const sendErrorMessage = useMemo(() => {
    const err = sendMutation.error;
    if (!err) return null;
    if (isOffline) {
      return 'Sin conexión. Revisa tu red e inténtalo de nuevo.';
    }
    if (err instanceof AppError) {
      switch (err.code) {
        case 'TIMEOUT':
          return 'La respuesta tardó demasiado. Puedes reintentar.';
        case 'CANCELLED':
          return 'Solicitud cancelada.';
        case 'NETWORK':
          return 'No hay conexión con el tutor. Revisa la red o la API.';
        default:
          return err.message;
      }
    }
    if (err instanceof Error) return err.message;
    return 'No se pudo enviar el mensaje';
  }, [sendMutation.error, isOffline]);

  const send = useCallback(
    (overrideMessage?: string) => {
      const message = (overrideMessage ?? draft).trim();
      if (!message || sendMutation.isPending) return;
      sendMutation.mutate(message);
    },
    [draft, sendMutation],
  );

  const cancelSend = useCallback(() => {
    const controller = abortRef.current;
    if (!controller) return;
    abortRef.current = null;
    controller.abort();
  }, []);

  const retrySend = useCallback(() => {
    const message = lastFailedMessageRef.current?.trim() || draft.trim();
    if (!message || sendMutation.isPending) return;
    sendMutation.mutate(message);
  }, [draft, sendMutation]);

  const applyQuickAction = useCallback((prompt: string) => {
    setDraft(prompt);
  }, []);

  return {
    subject,
    setSubject,
    difficulty,
    setDifficulty,
    draft,
    setDraft,
    session,
    isLoadingSession: sessionQuery.isLoading,
    isSessionError: sessionQuery.isError,
    refetchSession: sessionQuery.refetch,
    send,
    cancelSend,
    applyQuickAction,
    startNewSession: () => {
      if (sendMutation.isPending) {
        cancelSend();
      }
      newSessionMutation.mutate();
    },
    isSending: sendMutation.isPending,
    isSendSuccess: sendMutation.isSuccess && !sendMutation.isPending,
    isSendError: sendMutation.isError,
    sendErrorMessage,
    sendErrorKind,
    isOffline,
    retrySend,
    clearSendError: () => {
      lastFailedMessageRef.current = null;
      sendMutation.reset();
    },
    isStartingSession: newSessionMutation.isPending,
  };
}
