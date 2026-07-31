/** Tutoring ports — outbound adapters implement these. */

import type {
  ChatMessage,
  Difficulty,
  Subject,
  TutorSession,
  UserRole,
} from '../domain';

export type SendTutorMessageInput = {
  message: string;
  subject: Subject;
  difficulty: Difficulty;
  userRole: UserRole;
  /** Prior turns (excluding the message being sent). */
  conversation: ChatMessage[];
  signal?: AbortSignal;
};

export type SendTutorMessageResult = {
  reply: ChatMessage;
  provider?: string;
  model?: string | null;
  requestId?: string;
};

export interface TutorEngine {
  sendMessage(input: SendTutorMessageInput): Promise<SendTutorMessageResult>;
}

export interface ConversationRepository {
  load(): Promise<TutorSession | null>;
  save(session: TutorSession): Promise<void>;
  clear(): Promise<void>;
}
