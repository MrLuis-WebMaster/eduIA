export type {
  ThemePreference,
  UserRole,
  PreferredLevel,
  ExplanationStyle,
  TutorPersonality,
  FavoriteSubject,
  UserProfile,
  AppPreferences,
  UserPreferences,
} from './types';

export {
  THEME_OPTIONS,
  THEME_LABELS,
  ROLE_OPTIONS,
  LEVEL_OPTIONS,
  STYLE_OPTIONS,
  PERSONALITY_OPTIONS,
  SUBJECT_OPTIONS,
  WEEKLY_QUESTION_GOAL_OPTIONS,
  WEEKLY_QUESTION_GOAL_MIN,
  WEEKLY_QUESTION_GOAL_MAX,
} from './constants';

export {
  defaultUserProfile,
  defaultAppPreferences,
  defaultUserPreferences,
} from './defaults';

export {
  DISPLAY_NAME_MAX_LENGTH,
  normalizeProfile,
  normalizeAppPreferences,
  normalizeUserPreferences,
  emptyUserProfile,
  emptyAppPreferences,
} from './entities/user-preferences';

export {
  parseThemePreference,
  parseWeeklyQuestionGoal,
} from './value-objects/theme-and-goal';
