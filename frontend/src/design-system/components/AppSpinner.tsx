import { ActivityIndicator, View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { AppText } from './AppText';
import { layout } from '../tokens/layout';
import { cn } from '../utils/cn';
import { useTheme } from '../ThemeProvider';

const spinnerVariants = cva('gap-2', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    fill: {
      true: 'min-h-0 w-full flex-1',
      false: '',
    },
    placement: {
      center: 'justify-center',
      start: 'justify-start pt-2',
    },
    align: {
      center: 'items-center',
      start: 'items-start',
    },
  },
  defaultVariants: {
    size: 'md',
    fill: false,
    placement: 'center',
    align: 'center',
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
  fill,
  placement = 'center',
  align = 'center',
  className,
  ...props
}: AppSpinnerProps) {
  const { colors } = useTheme();
  const indicatorSize = size === 'lg' ? 'large' : 'small';
  const textAlign = align === 'start' ? 'left' : 'center';

  return (
    <View
      className={cn(
        spinnerVariants({ size, fill, placement, align }),
        fill && layout.gutterClassName,
        className,
      )}
      {...props}>
      <ActivityIndicator size={indicatorSize} color={colors.primary} />
      {label ? (
        <AppText tone="muted" variant="caption" align={textAlign}>
          {label}
        </AppText>
      ) : null}
    </View>
  );
}
