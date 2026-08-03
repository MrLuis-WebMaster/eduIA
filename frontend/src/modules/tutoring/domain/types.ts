/** Tutoring domain value objects and entities. */

export type Subject =
  | 'math'
  | 'science'
  | 'language'
  | 'history'
  | 'other';

export type Difficulty = 'basic' | 'intermediate' | 'advanced';

export type UserRole = 'student' | 'teacher';

export type ExplanationStyle = 'simple' | 'detailed' | 'socratic';

export type TutorPersonality =
  | 'friendly'
  | 'formal'
  | 'motivating'
  | 'patient'
  | 'direct';

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
  accent: 'violet' | 'pink' | 'orange' | 'green' | 'teal';
};

/** Contextual chip shown under the latest assistant reply. */
export type FollowUpSuggestion = {
  id: string;
  label: string;
  prompt: string;
};

export type FollowUpKind = 'explanation' | 'activity' | 'summary';
