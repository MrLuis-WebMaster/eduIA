/** Tutoring domain value objects and entities. */

import type { Difficulty, Subject } from '@/shared/domain';

export type {
  Subject,
  Difficulty,
  UserRole,
  ExplanationStyle,
  TutorPersonality,
} from '@/shared/domain';

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type TutorSession = {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  messages: ChatMessage[];
  updatedAt: string;
};

export type QuickActionId =
  | 'explain'
  | 'example'
  | 'question'
  | 'steps'
  | 'class-ideas'
  | 'common-errors'
  | 'formative';

export type QuickAction = {
  id: QuickActionId;
  label: string;
  prompt: string;
};

/** Contextual chip shown under the latest assistant reply. */
export type FollowUpSuggestion = {
  id: string;
  label: string;
  prompt: string;
};

export type FollowUpKind = 'explanation' | 'activity' | 'summary';
