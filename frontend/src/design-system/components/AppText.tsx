import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/cn';

const textVariants = cva('text-foreground dark:text-foreground-dark', {
  variants: {
    variant: {
      display: 'text-3xl font-bold',
      title: 'text-2xl font-bold',
      subtitle: 'text-xl font-semibold',
      body: 'text-base font-normal',
      label: 'text-sm font-medium',
      caption: 'text-xs font-normal',
      mono: 'text-sm font-normal font-mono',
    },
    tone: {
      default: '',
      muted: 'text-foreground-muted dark:text-foreground-dark-muted',
      inverse: 'text-foreground-inverse',
      primary: 'text-primary dark:text-primary-dark',
      danger: 'text-danger dark:text-danger-dark',
      success: 'text-success dark:text-success-dark',
      warning: 'text-warning dark:text-warning-dark',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    variant: 'body',
    tone: 'default',
    align: 'left',
  },
});

export type AppTextProps = RNTextProps &
  VariantProps<typeof textVariants> & {
    className?: string;
  };

export function AppText({
  className,
  variant,
  tone,
  align,
  ...props
}: AppTextProps) {
  return (
    <RNText
      className={cn(textVariants({ variant, tone, align }), className)}
      {...props}
    />
  );
}
