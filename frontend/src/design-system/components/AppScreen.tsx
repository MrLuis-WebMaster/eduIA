import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { Box } from '../primitives/Box';
import { Stack, type StackProps } from '../primitives/Stack';
import { layout } from '../tokens/layout';
import { cn } from '../utils/cn';
import { AppText } from './AppText';
import { KeyboardSpacer } from './KeyboardSpacer';

type AppScreenProps = {
  children: ReactNode;
  /** Sticky top region (outside scroll). */
  header?: ReactNode;
  /** Sticky bottom region (outside scroll) — e.g. chat composer. */
  footer?: ReactNode;
  /** Scrollable body. Default false. */
  scroll?: boolean;
  /** Lift sticky footer above the software keyboard (device IME height). */
  keyboard?: boolean;
  /** Safe-area edges. Default none — tabs layout owns the top inset via AppHeader. */
  edges?: Edge[];
  /** Apply shared horizontal gutter + top padding to the body stack. */
  padded?: boolean;
  /** Vertical gap between body children. */
  gap?: StackProps['gap'];
  className?: string;
  contentClassName?: string;
  accessibilityLabel?: string;
};

export function AppScreen({
  children,
  header,
  footer,
  scroll = false,
  keyboard = false,
  edges = [],
  padded = true,
  gap = layout.gap,
  className,
  contentClassName,
  accessibilityLabel,
}: AppScreenProps) {
  const body = (
    <Stack
      gap={gap}
      className={cn(
        'flex-1',
        padded && cn(layout.gutterClassName, layout.contentTopClassName),
        contentClassName,
      )}>
      {children}
    </Stack>
  );

  const main = scroll ? (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: layout.scrollBottom,
      }}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel={accessibilityLabel}>
      {body}
    </ScrollView>
  ) : (
    body
  );

  return (
    <Box className={cn('flex-1 bg-background', className)}>
      <SafeAreaView style={{ flex: 1 }} edges={edges}>
        <View className="min-h-0 flex-1">
          {header}
          {main}
          {footer}
          {keyboard ? <KeyboardSpacer /> : null}
        </View>
      </SafeAreaView>
    </Box>
  );
}

type AppScreenSectionProps = {
  children: ReactNode;
  className?: string;
};

/** Horizontal gutter aligned with AppScreen padded content. */
export function AppScreenSection({ children, className }: AppScreenSectionProps) {
  return (
    <View className={cn(layout.gutterClassName, className)}>{children}</View>
  );
}

type AppScreenHeadingProps = {
  title: string;
  description?: string;
  className?: string;
};

export function AppScreenHeading({
  title,
  description,
  className,
}: AppScreenHeadingProps) {
  return (
    <Stack gap="xs" className={className}>
      <AppText variant="subtitle">{title}</AppText>
      {description ? (
        <AppText tone="muted" variant="caption">
          {description}
        </AppText>
      ) : null}
    </Stack>
  );
}
