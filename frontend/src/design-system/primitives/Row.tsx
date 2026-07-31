import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/cn';

const rowVariants = cva('flex flex-row', {
  variants: {
    gap: {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
      xl: 'gap-6',
    },
    align: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    },
    justify: {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
    },
    wrap: {
      true: 'flex-wrap',
      false: 'flex-nowrap',
    },
  },
  defaultVariants: {
    gap: 'md',
    align: 'center',
    justify: 'start',
    wrap: false,
  },
});

export type RowProps = ViewProps &
  VariantProps<typeof rowVariants> & {
    className?: string;
  };

export function Row({ className, gap, align, justify, wrap, ...props }: RowProps) {
  return (
    <View
      className={cn(rowVariants({ gap, align, justify, wrap }), className)}
      {...props}
    />
  );
}
