import { View, type ViewProps } from 'react-native';

import { cn } from '../utils/cn';

export type BoxProps = ViewProps & {
  className?: string;
};

export function Box({ className, ...props }: BoxProps) {
  return <View className={cn(className)} {...props} />;
}
