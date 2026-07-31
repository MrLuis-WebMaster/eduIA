/** Public API — tutoring module. */

export type {
  Subject,
  Difficulty,
  UserRole,
  ChatMessage,
} from './domain';

export type {
  SendTutorMessageInput,
  SendTutorMessageResult,
} from './application';

export type { TutorEngine } from './adapters/ports';
export { FakeTutorEngine, HttpTutorEngine } from './adapters';

export {
  createTutoringModule,
  type TutoringDependencies,
} from './composition';
