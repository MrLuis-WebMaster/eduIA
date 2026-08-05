import type { KeyValueStorage } from '@/shared';

import {
  AsyncStorageConversationRepository,
  FakeTutorEngine,
  HttpTutorEngine,
  type ConversationRepository,
  type TutorEngine,
} from '../infrastructure';
import {
  createClearConversation,
  createEnsureActiveSession,
  createListRecentSessions,
  createLoadConversation,
  createSendTutorMessage,
  createStartNewSession,
  type EnsureActiveSessionInput,
  type SendTutorMessageCommand,
  type SendTutorMessageOutcome,
  type StartNewSessionInput,
} from '../application';
import type { RecentTutoringSessionDto, TutorSession } from '../domain';

export type TutoringModuleOptions = {
  apiUrl: string;
  useFake: boolean;
  requestTimeoutMs?: number;
  storage: KeyValueStorage;
};

export type TutoringDependencies = {
  tutorEngine: TutorEngine;
  /** Exposed for tests/infrastructure; UI should use use cases. */
  conversationRepository: ConversationRepository;
  sendMessage: (command: SendTutorMessageCommand) => Promise<SendTutorMessageOutcome>;
  loadConversation: () => Promise<TutorSession | null>;
  ensureActiveSession: (
    input?: EnsureActiveSessionInput,
  ) => Promise<TutorSession>;
  startNewSession: (input?: StartNewSessionInput) => Promise<TutorSession>;
  clearConversation: () => Promise<void>;
  listRecentSessions: (limit?: number) => Promise<RecentTutoringSessionDto[]>;
};

/** Manual composition root for the tutoring module. */
export function createTutoringModule(
  options: TutoringModuleOptions,
): TutoringDependencies {
  const tutorEngine: TutorEngine = options.useFake
    ? new FakeTutorEngine()
    : new HttpTutorEngine(options.apiUrl, options.requestTimeoutMs);

  const conversationRepository = new AsyncStorageConversationRepository(
    options.storage,
  );

  return {
    tutorEngine,
    conversationRepository,
    sendMessage: createSendTutorMessage({
      tutorEngine,
      conversationRepository,
    }),
    loadConversation: createLoadConversation({ conversationRepository }),
    ensureActiveSession: createEnsureActiveSession({ conversationRepository }),
    startNewSession: createStartNewSession({ conversationRepository }),
    clearConversation: createClearConversation({ conversationRepository }),
    listRecentSessions: createListRecentSessions({ conversationRepository }),
  };
}
