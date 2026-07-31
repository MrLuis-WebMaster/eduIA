import {
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
} from 'react-native';

import { cn } from '../utils/cn';

export type PressableProps = RNPressableProps & {
  className?: string;
};

export function Pressable({ className, ...props }: PressableProps) {
  return <RNPressable className={cn(className)} {...props} />;
}
