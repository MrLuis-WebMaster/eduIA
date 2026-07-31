/** Public API — learning-progress module. */

export type { ProgressSummary } from './domain';
export { getProgressSummary } from './application';
export {
  InMemoryProgressRepository,
  type ProgressRepository,
} from './adapters';
export {
  createLearningProgressModule,
  type LearningProgressDependencies,
} from './composition';
