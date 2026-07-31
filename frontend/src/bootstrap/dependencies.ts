import { createLearningProgressModule } from '@/modules/learning-progress';
import { createTutoringModule } from '@/modules/tutoring';
import { createUserPreferencesModule } from '@/modules/user-preferences';
import { getAppConfig, MemoryStorage, type KeyValueStorage } from '@/shared';

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

  return {
    storage: new MemoryStorage(),
    tutoring: createTutoringModule({
      apiUrl: config.apiUrl,
      useFake: config.useFakeTutor,
    }),
    learningProgress: createLearningProgressModule(),
    userPreferences: createUserPreferencesModule(),
  };
}

export function getDependencies(): AppDependencies {
  if (!dependencies) {
    dependencies = createDependencies();
  }
  return dependencies;
}
