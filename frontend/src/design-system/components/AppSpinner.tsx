import { ActivityIndicator, View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { AppText } from './AppText';
import { cn } from '../utils/cn';
import { useTheme } from '../ThemeProvider';

const spinnerVariants = cva('items-center justify-center gap-2', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type AppSpinnerProps = ViewProps &
  VariantProps<typeof spinnerVariants> & {
    label?: string;
    className?: string;
  };

export function AppSpinner({
  label,
  size = 'md',
  className,
  ...props
}: AppSpinnerProps) {
  const { colors } = useTheme();
  const indicatorSize = size === 'lg' ? 'large' : 'small';

  return (
    <View className={cn(spinnerVariants({ size }), className)} {...props}>
      <ActivityIndicator size={indicatorSize} color={colors.primary} />
      {label ? (
        <AppText tone="muted" variant="caption">
          {label}
        </AppText>
      ) : null}
    </View>
  );
}
