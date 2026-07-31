import type { KeyValueStorage } from '@/shared';

import {
  AsyncStorageConversationRepository,
  FakeTutorEngine,
  HttpTutorEngine,
  type ConversationRepository,
  type TutorEngine,
} from '../adapters';
import {
  createClearConversation,
  createLoadConversation,
  createSendTutorMessage,
  createStartNewSession,
  type SendTutorMessageCommand,
  type SendTutorMessageOutcome,
  type StartNewSessionInput,
} from '../application';
import type { TutorSession } from '../domain';

export type TutoringModuleOptions = {
  apiUrl: string;
  useFake: boolean;
  requestTimeoutMs?: number;
  storage: KeyValueStorage;
};

export type TutoringDependencies = {
  tutorEngine: TutorEngine;
  conversationRepository: ConversationRepository;
  sendMessage: (command: SendTutorMessageCommand) => Promise<SendTutorMessageOutcome>;
  loadConversation: () => Promise<TutorSession | null>;
  startNewSession: (input?: StartNewSessionInput) => Promise<TutorSession>;
  clearConversation: () => Promise<void>;
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
    startNewSession: createStartNewSession({ conversationRepository }),
    clearConversation: createClearConversation({ conversationRepository }),
  };
}
