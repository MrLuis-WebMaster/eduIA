import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getDependencies } from '@/bootstrap';
import { AppError } from '@/shared';

import {
  createEmptySession,
  type Difficulty,
  type Subject,
  type TutorSession,
  type UserRole,
} from '../../domain';

export const TUTOR_SESSION_QUERY_KEY = ['tutoring', 'session'] as const;

export function useTutorSession(userRole: UserRole = 'student') {
  const queryClient = useQueryClient();
  const tutoring = getDependencies().tutoring;

  const [subject, setSubject] = useState<Subject>('math');
  const [difficulty, setDifficulty] = useState<Difficulty>('basic');
  const [draft, setDraft] = useState('');
  const [hydrated, setHydrated] = useState(false);

  const sessionQuery = useQuery({
    queryKey: TUTOR_SESSION_QUERY_KEY,
    queryFn: async (): Promise<TutorSession> => {
      const existing = await tutoring.loadConversation();
      if (existing) return existing;
      const fresh = createEmptySession('math', 'basic');
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

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      const current =
        queryClient.getQueryData<TutorSession>(TUTOR_SESSION_QUERY_KEY) ??
        session ??
        createEmptySession(subject, difficulty);

      return tutoring.sendMessage({
        message,
        subject,
        difficulty,
        userRole,
        session: {
          ...current,
          subject,
          difficulty,
        },
      });
    },
    onSuccess: (outcome) => {
      queryClient.setQueryData(TUTOR_SESSION_QUERY_KEY, outcome.session);
      setDraft('');
    },
  });

  const newSessionMutation = useMutation({
    mutationFn: async () =>
      tutoring.startNewSession({ subject, difficulty }),
    onSuccess: (fresh) => {
      queryClient.setQueryData(TUTOR_SESSION_QUERY_KEY, fresh);
      setDraft('');
      sendMutation.reset();
    },
  });

  const sendErrorMessage = useMemo(() => {
    const err = sendMutation.error;
    if (!err) return null;
    if (err instanceof AppError) return err.message;
    if (err instanceof Error) return err.message;
    return 'No se pudo enviar el mensaje';
  }, [sendMutation.error]);

  const send = useCallback(
    (overrideMessage?: string) => {
      const message = (overrideMessage ?? draft).trim();
      if (!message || sendMutation.isPending) return;
      sendMutation.mutate(message);
    },
    [draft, sendMutation],
  );

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
    applyQuickAction,
    startNewSession: () => newSessionMutation.mutate(),
    isSending: sendMutation.isPending,
    isSendSuccess: sendMutation.isSuccess && !sendMutation.isPending,
    isSendError: sendMutation.isError,
    sendErrorMessage,
    retrySend: () => {
      if (sendMutation.error && draft.trim()) {
        sendMutation.mutate(draft.trim());
        return;
      }
      sendMutation.reset();
    },
    clearSendError: () => sendMutation.reset(),
    isStartingSession: newSessionMutation.isPending,
  };
}
