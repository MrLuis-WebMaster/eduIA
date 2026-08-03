import type {
  AppPreferences,
  UserPreferences,
  UserProfile,
} from '../domain';

export const defaultUserProfile: UserProfile = {
  displayName: '',
  role: 'student',
  preferredLevel: 'basic',
  favoriteSubjects: [],
  explanationStyle: 'simple',
  tutorPersonality: 'friendly',
};

export const defaultAppPreferences: AppPreferences = {
  theme: 'system',
  weeklyQuestionGoal: 7,
};

export const defaultUserPreferences: UserPreferences = {
  ...defaultUserProfile,
  ...defaultAppPreferences,
};
