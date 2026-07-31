import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { cn } from '../utils/cn';

export type TextProps = RNTextProps & {
  className?: string;
};

/** Primitive Text with className support — prefer AppText for product UI. */
export function Text({ className, ...props }: TextProps) {
  return <RNText className={cn(className)} {...props} />;
}
