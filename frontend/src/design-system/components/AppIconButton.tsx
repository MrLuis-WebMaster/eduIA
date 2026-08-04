import { ActivityIndicator, type PressableProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';

import { Pressable } from '../primitives/Pressable';
import { cn } from '../utils/cn';
import { useTheme } from '../ThemeProvider';

const iconButtonVariants = cva(
  'items-center justify-center active:opacity-80',
  {
    variants: {
      variant: {
        solid: 'bg-primary',
        secondary:
          'bg-background-secondary border border-border',
        outline: 'border border-border bg-transparent',
        ghost: 'bg-transparent',
        surface:
          'bg-surface border border-border',
      },
      size: {
        xs: 'h-7 w-7 rounded-md',
        sm: 'h-8 w-8 rounded-lg',
        md: 'h-10 w-10 rounded-xl',
        lg: 'h-12 w-12 rounded-2xl',
      },
      rounded: {
        true: 'rounded-full',
        false: '',
      },
      disabled: {
        true: 'opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
      rounded: false,
      disabled: false,
    },
  },
);

const ICON_SIZE = { xs: 14, sm: 16, md: 20, lg: 22 } as const;

export type AppIconButtonProps = Omit<PressableProps, 'children' | 'disabled'> &
  VariantProps<typeof iconButtonVariants> & {
    icon: LucideIcon;
    accessibilityLabel: string;
    loading?: boolean;
    className?: string;
    iconClassName?: string;
    iconColor?: string;
  };

export function AppIconButton({
  icon: Icon,
  accessibilityLabel,
  loading = false,
  variant,
  size = 'md',
  rounded,
  disabled,
  className,
  iconColor,
  ...props
}: AppIconButtonProps) {
  const { colors } = useTheme();
  const isDisabled = Boolean(disabled || loading);
  const resolvedSize = size ?? 'md';

  const defaultIconColor =
    variant === 'solid'
      ? colors.primaryForeground
      : variant === 'ghost' || variant === 'outline'
        ? colors.foregroundMuted
        : colors.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={isDisabled}
      className={cn(
        iconButtonVariants({
          variant,
          size,
          rounded,
          disabled: isDisabled,
        }),
        className,
      )}
      {...props}>
      {loading ? (
        <ActivityIndicator size="small" color={iconColor ?? defaultIconColor} />
      ) : (
        <Icon
          size={ICON_SIZE[resolvedSize]}
          color={iconColor ?? defaultIconColor}
          strokeWidth={2}
        />
      )}
    </Pressable>
  );
}
