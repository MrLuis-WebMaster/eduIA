import { colors } from '../tokens/colors';

export type ThemeColors = {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  foreground: string;
  foregroundMuted: string;
  foregroundInverse: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryForeground: string;
  primaryMuted: string;
  secondary: string;
  secondaryForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  danger: string;
  dangerForeground: string;
};

export const lightTheme: ThemeColors = {
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  foreground: colors.navy[900],
  foregroundMuted: colors.navy[600],
  foregroundInverse: '#F8FAFC',
  border: colors.navy[100],
  borderStrong: colors.navy[300],
  primary: colors.teal[600],
  primaryForeground: '#FFFFFF',
  primaryMuted: colors.teal[100],
  secondary: colors.navy[800],
  secondaryForeground: '#F8FAFC',
  success: '#059669',
  successForeground: '#FFFFFF',
  warning: '#D97706',
  warningForeground: '#FFFFFF',
  danger: '#DC2626',
  dangerForeground: '#FFFFFF',
};
