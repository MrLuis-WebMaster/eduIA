import { createLearningProgressModule } from '@/modules/learning-progress/composition';
import { createTutoringModule } from '@/modules/tutoring/composition';
import { createUserPreferencesModule } from '@/modules/user-preferences/composition';
import {
  AsyncStorageAdapter,
  getAppConfig,
  type KeyValueStorage,
} from '@/shared';

export type AppDependencies = {
  storage: KeyValueStorage;
  tutoring: ReturnType<typeof createTutoringModule>;
  learningProgress: ReturnType<typeof createLearningProgressModule>;
  userPreferences: ReturnType<typeof createUserPreferencesModule>;
};

let dependencies: AppDependencies | null = null;

/** Manual composition root — single place to wire adapters. */
export function createDependencies(): AppDependencies {
  const config = getAppConfig();
  const storage = new AsyncStorageAdapter();

  const tutoring = createTutoringModule({
    apiUrl: config.apiUrl,
    useFake: config.useFakeTutor,
    requestTimeoutMs: config.requestTimeoutMs,
    storage,
  });

  return {
    storage,
    tutoring,
    learningProgress: createLearningProgressModule({
      listRecentSessions: tutoring.listRecentSessions,
    }),
    userPreferences: createUserPreferencesModule({ storage }),
  };
}

export function getDependencies(): AppDependencies {
  if (!dependencies) {
    dependencies = createDependencies();
  }
  return dependencies;
}

/** Test helper — reset singleton between suites. */
export function resetDependencies(): void {
  dependencies = null;
}
