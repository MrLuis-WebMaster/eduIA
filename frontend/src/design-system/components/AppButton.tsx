import { ActivityIndicator, type PressableProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-lg active:opacity-80',
  {
    variants: {
      variant: {
        solid: 'bg-primary dark:bg-primary-dark',
        secondary: 'bg-secondary dark:bg-secondary-dark',
        outline: 'border border-border dark:border-border-dark bg-transparent',
        ghost: 'bg-transparent',
        danger: 'bg-danger dark:bg-danger-dark',
      },
      size: {
        sm: 'h-9 px-3 gap-1.5',
        md: 'h-11 px-4 gap-2',
        lg: 'h-12 px-5 gap-2',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
      fullWidth: false,
      disabled: false,
    },
  },
);

const buttonLabelVariants = cva('font-semibold', {
  variants: {
    variant: {
      solid: 'text-primary-foreground dark:text-primary-dark-foreground',
      secondary: 'text-secondary-foreground dark:text-secondary-dark-foreground',
      outline: 'text-foreground dark:text-foreground-dark',
      ghost: 'text-primary dark:text-primary-dark',
      danger: 'text-danger-foreground dark:text-danger-dark-foreground',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});

export type AppButtonProps = Omit<PressableProps, 'children' | 'disabled'> &
  VariantProps<typeof buttonVariants> & {
    label: string;
    loading?: boolean;
    className?: string;
    textClassName?: string;
  };

export function AppButton({
  label,
  loading = false,
  variant,
  size,
  fullWidth,
  disabled,
  className,
  textClassName,
  ...props
}: AppButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant, size, fullWidth, disabled: isDisabled }),
        className,
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost' ? '#0D9488' : '#FFFFFF'
          }
        />
      ) : (
        <Text className={cn(buttonLabelVariants({ variant, size }), textClassName)}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
