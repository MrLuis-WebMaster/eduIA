/** Tutoring domain types and rules (stubs — Day 3–4). */

export type Subject =
  | 'math'
  | 'science'
  | 'language'
  | 'history'
  | 'other';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type UserRole = 'student' | 'teacher';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
};
