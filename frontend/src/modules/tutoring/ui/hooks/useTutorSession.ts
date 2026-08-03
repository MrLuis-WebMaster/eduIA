import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

import { getDependencies } from '@/bootstrap/dependencies';
import { AppError, getAppConfig, httpJson } from '@/shared';

import {
  createEmptySession,
  createMessageId,
  type ChatMessage,
  type Difficulty,
  type ExplanationStyle,
  type Subject,
  type TutorPersonality,
  type TutorSession,
  type UserRole,
} from '../../domain';
import { RECENT_TUTORING_SESSIONS_QUERY_KEY } from './useRecentTutoringSessions';

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
  explanationStyle: ExplanationStyle = 'simple',
  tutorPersonality: TutorPersonality = 'friendly',
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
  /** Shown immediately while waiting for the tutor reply (not persisted yet). */
  const [pendingUserMessage, setPendingUserMessage] =
    useState<ChatMessage | null>(null);

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

  const displaySession = useMemo((): TutorSession | undefined => {
    if (!pendingUserMessage) return session;
    if (!session) {
      return {
        ...createEmptySession(subject, difficulty),
        messages: [pendingUserMessage],
      };
    }
    const alreadyPresent = session.messages.some(
      (m) =>
        m.id === pendingUserMessage.id ||
        (m.role === 'user' && m.content === pendingUserMessage.content),
    );
    if (alreadyPresent) return session;
    return {
      ...session,
      messages: [...session.messages, pendingUserMessage],
    };
  }, [session, pendingUserMessage, subject, difficulty]);

  const showPendingUserMessage = useCallback((message: string) => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setPendingUserMessage((current) => {
      if (current?.content === trimmed) return current;
      return {
        id: createMessageId('user'),
        role: 'user',
        content: trimmed,
        createdAt: new Date().toISOString(),
      };
    });
    setDraft('');
  }, []);

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
          explanationStyle,
          tutorPersonality,
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
      setPendingUserMessage(null);
      queryClient.setQueryData(TUTOR_SESSION_QUERY_KEY, outcome.session);
      void queryClient.invalidateQueries({
        queryKey: RECENT_TUTORING_SESSIONS_QUERY_KEY,
      });
      setDraft('');
      lastFailedMessageRef.current = null;
    },
    onError: (error, message) => {
      if (error instanceof AppError && error.code === 'CANCELLED') {
        // User stopped generation — restore draft, never treat as a failure.
        setPendingUserMessage(null);
        setDraft(message);
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
      setPendingUserMessage(null);
      queryClient.setQueryData(TUTOR_SESSION_QUERY_KEY, fresh);
      void queryClient.invalidateQueries({
        queryKey: RECENT_TUTORING_SESSIONS_QUERY_KEY,
      });
      setDraft('');
      lastFailedMessageRef.current = null;
      sendMutation.reset();
    },
  });

  const sendErrorKind = useMemo((): TutorSendErrorKind | null => {
    const err = sendMutation.error;
    if (!err) return null;
    if (err instanceof AppError && err.code === 'CANCELLED') {
      return 'cancelled';
    }
    if (isOffline) return 'offline';
    if (err instanceof AppError) {
      switch (err.code) {
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
  }, [sendMutation.error, isOffline]);

  const sendErrorMessage = useMemo(() => {
    const err = sendMutation.error;
    if (!err) return null;
    if (err instanceof AppError && err.code === 'CANCELLED') {
      return null;
    }
    if (isOffline) {
      return 'Sin conexión. Revisa tu red e inténtalo de nuevo.';
    }
    if (err instanceof AppError) {
      switch (err.code) {
        case 'TIMEOUT':
          return 'La respuesta tardó demasiado. Puedes reintentar.';
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
      showPendingUserMessage(message);
      sendMutation.mutate(message);
    },
    [draft, sendMutation, showPendingUserMessage],
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
    showPendingUserMessage(message);
    sendMutation.mutate(message);
  }, [draft, sendMutation, showPendingUserMessage]);

  const applyQuickAction = useCallback((prompt: string) => {
    lastFailedMessageRef.current = null;
    sendMutation.reset();
    setDraft(prompt);
  }, [sendMutation]);

  const startNewSession = useCallback(() => {
    if (sendMutation.isPending) {
      cancelSend();
    }
    newSessionMutation.mutate();
  }, [sendMutation.isPending, cancelSend, newSessionMutation]);

  const clearSendError = useCallback(() => {
    lastFailedMessageRef.current = null;
    sendMutation.reset();
  }, [sendMutation]);

  return {
    subject,
    setSubject,
    difficulty,
    setDifficulty,
    draft,
    setDraft,
    session: displaySession,
    isLoadingSession: sessionQuery.isLoading,
    isSessionError: sessionQuery.isError,
    refetchSession: sessionQuery.refetch,
    send,
    cancelSend,
    applyQuickAction,
    startNewSession,
    isSending: sendMutation.isPending,
    isSendSuccess: sendMutation.isSuccess && !sendMutation.isPending,
    isSendError:
      sendMutation.isError &&
      !(
        sendMutation.error instanceof AppError &&
        sendMutation.error.code === 'CANCELLED'
      ),
    sendErrorMessage,
    sendErrorKind: sendErrorKind === 'cancelled' ? null : sendErrorKind,
    isOffline,
    retrySend,
    clearSendError,
    isStartingSession: newSessionMutation.isPending,
  };
}
