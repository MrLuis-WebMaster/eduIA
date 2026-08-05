import { createContext, useContext, type Context } from 'react';

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

export const DependenciesContext: Context<AppDependencies | null> =
  createContext(null as AppDependencies | null);

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

/** Singleton accessor for non-React code (Zustand store, tests). */
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

/** React tree should prefer this over getDependencies(). */
export function useAppDependencies(): AppDependencies {
  const fromContext = useContext(DependenciesContext);
  if (fromContext) return fromContext;
  return getDependencies();
}
