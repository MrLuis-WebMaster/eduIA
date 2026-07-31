import { colors } from '../tokens/colors';
import type { ThemeColors } from './light';

export const darkTheme: ThemeColors = {
  background: colors.navy[900],
  backgroundSecondary: colors.navy[800],
  surface: colors.navy[800],
  surfaceElevated: colors.navy[700],
  foreground: colors.navy[50],
  foregroundMuted: colors.navy[300],
  foregroundInverse: colors.navy[900],
  border: colors.navy[600],
  borderStrong: colors.navy[500],
  primary: colors.teal[400],
  primaryForeground: colors.navy[900],
  primaryMuted: colors.teal[800],
  secondary: colors.teal[100],
  secondaryForeground: colors.navy[900],
  success: '#34D399',
  successForeground: colors.navy[900],
  warning: '#FBBF24',
  warningForeground: colors.navy[900],
  danger: '#F87171',
  dangerForeground: colors.navy[900],
};
