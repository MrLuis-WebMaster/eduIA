/** Theme and goal value-object helpers. */

import {
  WEEKLY_QUESTION_GOAL_MAX,
  WEEKLY_QUESTION_GOAL_MIN,
} from '../constants';
import { defaultAppPreferences } from '../defaults';
import type { ThemePreference } from '../types';

const VALID_THEMES: ThemePreference[] = ['system', 'light', 'dark'];

export function parseThemePreference(
  value: unknown,
  fallback: ThemePreference = defaultAppPreferences.theme,
): ThemePreference {
  return VALID_THEMES.includes(value as ThemePreference)
    ? (value as ThemePreference)
    : fallback;
}

export function parseWeeklyQuestionGoal(
  value: unknown,
  fallback: number = defaultAppPreferences.weeklyQuestionGoal,
): number {
  if (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= WEEKLY_QUESTION_GOAL_MIN &&
    value <= WEEKLY_QUESTION_GOAL_MAX
  ) {
    return Math.round(value);
  }
  return fallback;
}
