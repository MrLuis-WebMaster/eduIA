/**
 * Legacy theme constants retained for existing template components.
 * Prefer `@/design-system` tokens and ThemeProvider for new UI.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#102A43',
    background: '#F8FAFC',
    backgroundElement: '#F1F5F9',
    backgroundSelected: '#D9E2EC',
    textSecondary: '#486581',
  },
  dark: {
    text: '#F0F4F8',
    background: '#102A43',
    backgroundElement: '#243B53',
    backgroundSelected: '#334E68',
    textSecondary: '#9FB3C8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'system-ui',
    serif: 'Georgia, serif',
    rounded: 'system-ui',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
