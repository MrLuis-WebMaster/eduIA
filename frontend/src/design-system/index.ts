/** Public Design System API — import from `@/design-system`. */

export { cn } from './utils/cn';

export * from './tokens';
export * from './themes';

export { ThemeProvider, useTheme } from './ThemeProvider';
export type { ThemePreference, ResolvedColorScheme, ThemeProviderProps } from './ThemeProvider';

export {
  Box,
  Stack,
  Row,
  Text,
  Pressable,
} from './primitives';
export type {
  BoxProps,
  StackProps,
  RowProps,
  TextProps,
  PressableProps,
} from './primitives';

export {
  AppText,
  AppButton,
  AppInput,
  AppTextArea,
  AppCard,
  AppChip,
  AppSegmentedControl,
  AppEmptyState,
  AppErrorState,
  AppSkeleton,
  AppSpinner,
} from './components';
export type {
  AppTextProps,
  AppButtonProps,
  AppInputProps,
  AppTextAreaProps,
  AppCardProps,
  AppChipProps,
  AppSegmentedControlProps,
  SegmentOption,
  AppEmptyStateProps,
  AppErrorStateProps,
  AppSkeletonProps,
  AppSpinnerProps,
} from './components';
