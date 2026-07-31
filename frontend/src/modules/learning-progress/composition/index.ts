/** Learning progress composition (stubs — Day 6). */

import {
  InMemoryProgressRepository,
  type ProgressRepository,
} from '../adapters';

export type LearningProgressDependencies = {
  progressRepository: ProgressRepository;
};

export function createLearningProgressModule(): LearningProgressDependencies {
  return {
    progressRepository: new InMemoryProgressRepository(),
  };
}
