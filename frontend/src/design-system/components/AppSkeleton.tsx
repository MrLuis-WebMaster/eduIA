import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/cn';

const skeletonVariants = cva(
  'animate-pulse bg-background-secondary dark:bg-background-dark-secondary',
  {
    variants: {
      shape: {
        rect: 'rounded-md',
        circle: 'rounded-full',
        text: 'rounded h-4',
      },
    },
    defaultVariants: {
      shape: 'rect',
    },
  },
);

export type AppSkeletonProps = ViewProps &
  VariantProps<typeof skeletonVariants> & {
    className?: string;
    width?: number | `${number}%`;
    height?: number;
  };

export function AppSkeleton({
  className,
  shape,
  width,
  height,
  style,
  ...props
}: AppSkeletonProps) {
  return (
    <View
      className={cn(skeletonVariants({ shape }), className)}
      style={[{ width, height }, style]}
      {...props}
    />
  );
}
