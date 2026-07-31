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
};

export const defaultAppPreferences: AppPreferences = {
  theme: 'system',
};

export const defaultUserPreferences: UserPreferences = {
  ...defaultUserProfile,
  ...defaultAppPreferences,
};
