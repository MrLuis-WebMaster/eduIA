import { vars } from 'nativewind';

import type { ThemeColors } from './themes';

/** Maps semantic theme colors to NativeWind CSS variables. */
export function themeVars(colors: ThemeColors) {
  return vars({
    '--color-background': colors.background,
    '--color-background-secondary': colors.backgroundSecondary,
    '--color-surface': colors.surface,
    '--color-surface-elevated': colors.surfaceElevated,
    '--color-foreground': colors.foreground,
    '--color-foreground-muted': colors.foregroundMuted,
    '--color-foreground-inverse': colors.foregroundInverse,
    '--color-border': colors.border,
    '--color-border-strong': colors.borderStrong,
    '--color-primary': colors.primary,
    '--color-primary-foreground': colors.primaryForeground,
    '--color-primary-muted': colors.primaryMuted,
    '--color-secondary': colors.secondary,
    '--color-secondary-foreground': colors.secondaryForeground,
    '--color-success': colors.success,
    '--color-success-foreground': colors.successForeground,
    '--color-warning': colors.warning,
    '--color-warning-foreground': colors.warningForeground,
    '--color-danger': colors.danger,
    '--color-danger-foreground': colors.dangerForeground,
    '--color-chat-user': colors.chatUser,
    '--color-chat-user-foreground': colors.chatUserForeground,
  });
}
