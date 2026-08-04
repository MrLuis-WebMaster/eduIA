import type { LucideIcon } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Modal, Pressable as RNPressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, X } from 'lucide-react-native';

import { Pressable } from '../primitives/Pressable';
import { Row } from '../primitives/Row';
import { Stack } from '../primitives/Stack';
import { cn } from '../utils/cn';
import { ThemeSurface, useTheme } from '../ThemeProvider';
import { AppIconButton } from './AppIconButton';
import { AppText } from './AppText';

export type AppDrawerProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  header?: ReactNode;
  accessibilityLabel?: string;
};

/** Side panel that slides in from the left over a dimmed backdrop. */
export function AppDrawer({
  visible,
  onClose,
  children,
  title = 'Menú',
  header,
  accessibilityLabel,
}: AppDrawerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <ThemeSurface>
        <View className="flex-1 flex-row">
          <RNPressable
            className="w-[82%] max-w-sm border-r border-border bg-surface"
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
            onPress={(e) => e.stopPropagation()}
            accessibilityLabel={accessibilityLabel ?? title}>
            <Row
              align="center"
              justify="between"
              className="border-b border-border px-4 py-3"
              gap="sm">
              <AppText variant="subtitle" className="flex-1">
                {title}
              </AppText>
              <AppIconButton
                icon={X}
                size="sm"
                variant="ghost"
                rounded
                accessibilityLabel="Cerrar menú"
                iconColor={colors.foregroundMuted}
                onPress={onClose}
              />
            </Row>

            {header ? <View className="px-4 pt-4">{header}</View> : null}

            <ScrollView
              className="flex-1"
              contentContainerStyle={{ paddingVertical: 8, paddingBottom: 24 }}
              showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          </RNPressable>

          <RNPressable
            className="flex-1 bg-black/50"
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cerrar menú"
          />
        </View>
      </ThemeSurface>
    </Modal>
  );
}

export type AppDrawerItemProps = {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgClassName: string;
  onPress: () => void;
  active?: boolean;
};

/** Compact navigation row for use inside AppDrawer. */
export function AppDrawerItem({
  title,
  description,
  icon: Icon,
  iconColor,
  iconBgClassName,
  onPress,
  active,
}: AppDrawerItemProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={cn(
        'mx-2 rounded-2xl active:opacity-80',
        active && 'bg-primary/10',
      )}>
      <Row align="center" gap="md" className="px-3 py-3">
        <View
          className={cn(
            'h-10 w-10 items-center justify-center rounded-xl',
            iconBgClassName,
          )}>
          <Icon size={18} color={iconColor} strokeWidth={2} />
        </View>
        <Stack gap="none" className="min-w-0 flex-1">
          <AppText variant="label">{title}</AppText>
          {description ? (
            <AppText variant="caption" tone="muted" numberOfLines={2}>
              {description}
            </AppText>
          ) : null}
        </Stack>
        <ChevronRight
          size={18}
          color={colors.foregroundMuted}
          strokeWidth={2}
        />
      </Row>
    </Pressable>
  );
}
