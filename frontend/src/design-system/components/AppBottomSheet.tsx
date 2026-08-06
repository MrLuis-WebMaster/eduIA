import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable as RNPressable,
  ScrollView,
  View,
  type KeyboardEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

/**
 * IME height for Modal sheets. Reanimated's useAnimatedKeyboard is unreliable
 * inside RN Modal windows; Keyboard events still report the real frame.
 */
function useModalKeyboardHeight(active: boolean) {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!active) return;

    const onShow = (event: KeyboardEvent) => {
      setHeight(Math.max(0, Math.ceil(event.endCoordinates.height)));
    };
    const onHide = () => setHeight(0);

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [active]);

  return active ? height : 0;
}

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
  const insets = useSafeAreaInsets();
  const keyboardHeight = useModalKeyboardHeight(visible);
  const keyboardOpen = keyboardHeight > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <ThemeSurface>
        {/*
          Host/physical keyboards treat Space as "activate focused button".
          Never stack a Pressable over TextInput (absolute fill) — keep the
          backdrop as the flex spacer above the panel only.
        */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View
            className="flex-1 justify-end bg-black/50"
            style={
              Platform.OS === 'android'
                ? { paddingBottom: keyboardHeight }
                : undefined
            }>
            <RNPressable
              className="flex-1"
              onPress={onClose}
              focusable={false}
              accessibilityRole="button"
              accessibilityLabel="Cerrar"
            />
            <View
              className={cn(
                'rounded-t-3xl border-t border-border bg-surface pt-3',
                maxHeightClassName,
              )}
              style={{
                paddingBottom: keyboardOpen
                  ? 12
                  : Math.max(insets.bottom, 24),
              }}
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
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingBottom: 12,
                }}
                showsVerticalScrollIndicator={false}>
                {children}
              </ScrollView>

              {footer ? <View className="mt-2 px-4">{footer}</View> : null}
            </View>
          </View>
        </KeyboardAvoidingView>
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
