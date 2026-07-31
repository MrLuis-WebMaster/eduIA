export type Difficulty = 'basic' | 'intermediate' | 'advanced';
export type UserRole = 'student' | 'teacher';
export type ConversationRole = 'user' | 'assistant';

export interface ConversationMessage {
  role: ConversationRole;
  content: string;
}

export interface TutorRequest {
  message: string;
  subject: string;
  difficulty: Difficulty;
  userRole: UserRole;
  conversation: ConversationMessage[];
}

export interface TutorResponse {
  reply: string;
  provider: string;
  model?: string;
}
