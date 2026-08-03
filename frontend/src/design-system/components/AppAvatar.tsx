import { View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react-native';
import { Bot } from 'lucide-react-native';

import { cn } from '../utils/cn';
import { useTheme } from '../ThemeProvider';
import { Text } from '../primitives/Text';

const avatarVariants = cva('items-center justify-center rounded-full', {
  variants: {
    size: {
      sm: 'h-7 w-7',
      md: 'h-9 w-9',
      lg: 'h-11 w-11',
      xl: 'h-16 w-16',
    },
    tone: {
      primary: 'bg-primary dark:bg-primary-dark',
      surface:
        'bg-background-secondary dark:bg-background-dark-secondary border border-border dark:border-border-dark',
      muted: 'bg-surface-elevated dark:bg-surface-dark-elevated',
    },
  },
  defaultVariants: {
    size: 'sm',
    tone: 'surface',
  },
});

const ICON_SIZE = { sm: 14, md: 18, lg: 22, xl: 28 } as const;
const INITIALS_CLASS = {
  sm: 'text-xs font-semibold',
  md: 'text-xs font-semibold',
  lg: 'text-sm font-semibold',
  xl: 'text-lg font-semibold',
} as const;

export type AppAvatarProps = VariantProps<typeof avatarVariants> & {
  icon?: LucideIcon;
  initials?: string;
  className?: string;
  accessibilityLabel?: string;
};

export function AppAvatar({
  icon: Icon = Bot,
  initials,
  size = 'sm',
  tone,
  className,
  accessibilityLabel = 'Avatar',
}: AppAvatarProps) {
  const { colors } = useTheme();
  const resolvedSize = size ?? 'sm';
  const iconColor =
    tone === 'primary' ? colors.primaryForeground : colors.foregroundMuted;

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      className={cn(avatarVariants({ size, tone }), className)}>
      {initials ? (
        <Text
          className={cn(
            INITIALS_CLASS[resolvedSize],
            tone === 'primary'
              ? 'text-primary-foreground dark:text-primary-dark-foreground'
              : 'text-foreground dark:text-foreground-dark',
          )}>
          {initials.slice(0, 2).toUpperCase()}
        </Text>
      ) : (
        <Icon size={ICON_SIZE[resolvedSize]} color={iconColor} strokeWidth={2} />
      )}
    </View>
  );
}
