import { View, type ViewProps } from 'react-native';

import { cn } from '../utils/cn';

export type AppDividerProps = ViewProps & {
  className?: string;
};

/** Horizontal rule for list/menu separators. */
export function AppDivider({ className, ...props }: AppDividerProps) {
  return <View className={cn('mx-3 h-px bg-border', className)} {...props} />;
}
