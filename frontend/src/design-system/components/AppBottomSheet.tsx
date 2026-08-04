import type { ReactNode } from 'react';
import { Modal, Pressable as RNPressable, ScrollView, View } from 'react-native';
import { X } from 'lucide-react-native';

import { Row } from '../primitives/Row';
import { cn } from '../utils/cn';
import { ThemeSurface, useTheme } from '../ThemeProvider';
import { AppIconButton } from './AppIconButton';
import { AppText } from './AppText';

export type AppBottomSheetProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Max height of the sheet panel. */
  maxHeightClassName?: string;
  accessibilityLabel?: string;
};

export function AppBottomSheet({
  visible,
  title,
  onClose,
  children,
  footer,
  maxHeightClassName = 'max-h-[88%]',
  accessibilityLabel,
}: AppBottomSheetProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <ThemeSurface>
        <RNPressable
          className="flex-1 justify-end bg-black/50"
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cerrar">
          <RNPressable
            className={cn(
              'rounded-t-3xl border-t border-border bg-surface pb-6 pt-3',
              maxHeightClassName,
            )}
            onPress={(e) => e.stopPropagation()}
            accessibilityLabel={accessibilityLabel ?? title}>
            <View className="mb-2 items-center">
              <View className="h-1 w-10 rounded-full bg-border" />
            </View>

            <Row
              align="center"
              justify="between"
              className="mb-3 px-4"
              gap="sm">
              <AppText variant="subtitle" className="flex-1">
                {title}
              </AppText>
              <AppIconButton
                icon={X}
                size="sm"
                variant="ghost"
                rounded
                accessibilityLabel="Cerrar"
                iconColor={colors.foregroundMuted}
                onPress={onClose}
              />
            </Row>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>

            {footer ? <View className="mt-2 px-4">{footer}</View> : null}
          </RNPressable>
        </RNPressable>
      </ThemeSurface>
    </Modal>
  );
}

/** Compact success/error banner for sheet footers. */
export function AppSheetStatus({
  message,
  tone = 'success',
}: {
  message: string | null;
  tone?: 'success' | 'danger';
}) {
  if (!message) return null;

  return (
    <View
      className={cn(
        'mt-2 rounded-xl px-3 py-2.5',
        tone === 'success' ? 'bg-success/15' : 'bg-danger/15',
      )}>
      <AppText variant="caption" tone={tone} className="font-medium">
        {message}
      </AppText>
    </View>
  );
}
