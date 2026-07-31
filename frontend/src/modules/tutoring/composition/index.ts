/** Tutoring composition root (stubs — Day 4). */

import { FakeTutorEngine, HttpTutorEngine } from '../adapters';
import type { TutorEngine } from '../adapters/ports';

export type TutoringDependencies = {
  tutorEngine: TutorEngine;
};

export function createTutoringModule(options: {
  apiUrl?: string;
  useFake?: boolean;
}): TutoringDependencies {
  const tutorEngine =
    options.useFake || !options.apiUrl
      ? new FakeTutorEngine()
      : new HttpTutorEngine(options.apiUrl);

  return { tutorEngine };
}
