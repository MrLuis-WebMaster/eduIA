import {
  Pressable as RNPressable,
  type PressableProps as RNPressableProps,
} from 'react-native';

import { cn } from '../utils/cn';

export type PressableProps = RNPressableProps & {
  className?: string;
};

/**
 * Defaults focusable=false so host/physical keyboards send Space to TextInput
 * instead of activating the nearest focused button (common on Android emulators).
 * Pass focusable when keyboard focus navigation is intentionally required.
 */
export function Pressable({
  className,
  focusable = false,
  ...props
}: PressableProps) {
  return (
    <RNPressable className={cn(className)} focusable={focusable} {...props} />
  );
}
