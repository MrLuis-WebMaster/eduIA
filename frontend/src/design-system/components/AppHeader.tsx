import { useState } from 'react';
import { Image } from 'expo-image';
import {
  Bell,
  ChartColumn,
  GraduationCap,
  Menu,
  User,
  UserRound,
} from 'lucide-react-native';
import { usePathname, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { initialsFromName } from '@/shared/utils';

import { Pressable } from '../primitives/Pressable';
import { Row } from '../primitives/Row';
import { Stack } from '../primitives/Stack';
import { Text } from '../primitives/Text';
import { useTheme } from '../ThemeProvider';
import { AppAvatar } from './AppAvatar';import { AppDrawer, AppDrawerItem } from './AppDrawer';
import { AppIconButton } from './AppIconButton';
import { AppScreenSection } from './AppScreen';
import { AppText } from './AppText';

type AppHeaderProps = {
  /** Display name used for avatar initials. */
  displayName?: string;
  /** Optional profile image URI. */
  avatarUri?: string | null;
};

type DrawerRoute = '/(tabs)' | '/(tabs)/progress' | '/(tabs)/settings';

function isRouteActive(pathname: string, route: DrawerRoute): boolean {
  if (route === '/(tabs)') {
    return pathname === '/' || pathname === '/(tabs)' || pathname === '/index';
  }
  if (route === '/(tabs)/progress') {
    return pathname.includes('progress');
  }
  return pathname.includes('settings');
}

/** Persistent brand chrome shown above every tab screen. */
export function AppHeader({ displayName = '', avatarUri }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initials = initialsFromName(displayName);
  const label = displayName.trim() || 'Perfil';

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const goTo = (route: DrawerRoute) => {
    closeDrawer();
    router.push(route);
  };

  return (
    <>
      <View
        style={{ paddingTop: insets.top, backgroundColor: colors.background }}>
        <AppScreenSection>
          <Row justify="between" align="center" className="pb-1 pt-2">
            <Row align="center" gap="xs" className="min-w-0 flex-1 pr-2">
              <AppIconButton
                icon={Menu}
                accessibilityLabel="Abrir menú"
                variant="ghost"
                size="sm"
                className="-ml-1"
                iconColor={colors.foreground}
                onPress={openDrawer}
              />
              <Text
                className="text-xl font-semibold tracking-tight text-foreground"
                numberOfLines={1}>
                Tutor Edu
                <Text className="text-xl font-semibold text-primary">
                  IA
                </Text>
              </Text>
            </Row>

            <Row align="center" gap="xs" className="shrink-0">
              <AppIconButton
                icon={Bell}
                size="sm"
                variant="ghost"
                rounded
                accessibilityLabel="Notificaciones"
                iconColor={colors.foregroundMuted}
                onPress={() => {
                  Alert.alert(
                    'Notificaciones',
                    'No tienes notificaciones nuevas.',
                  );
                }}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Perfil de ${label}`}
                onPress={() => router.push('/(tabs)/settings')}
                className="active:opacity-80">
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: 36, height: 36, borderRadius: 18 }}
                    accessibilityLabel={label}
                  />
                ) : (
                  <AppAvatar
                    size="md"
                    tone="primary"
                    initials={initials || undefined}
                    icon={User}
                    accessibilityLabel={label}
                  />
                )}
              </Pressable>
            </Row>
          </Row>
        </AppScreenSection>
      </View>

      <AppDrawer
        visible={drawerOpen}
        onClose={closeDrawer}
        title="Menú"
        accessibilityLabel="Menú de navegación"
        header={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ir al perfil de ${label}`}
            onPress={() => goTo('/(tabs)/settings')}
            className="mb-2 active:opacity-80">
            <Row align="center" gap="md">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                  accessibilityLabel={label}
                />
              ) : (
                <AppAvatar
                  size="lg"
                  tone="primary"
                  initials={initials || undefined}
                  icon={User}
                  accessibilityLabel={label}
                />
              )}
              <Stack gap="none" className="min-w-0 flex-1">
                <AppText variant="label" numberOfLines={1}>
                  {label}
                </AppText>
                <AppText variant="caption" tone="muted">
                  Ver mi espacio
                </AppText>
              </Stack>
            </Row>
          </Pressable>
        }>
        <AppDrawerItem
          title="Tutor"
          description="Sesiones y chat de estudio"
          icon={GraduationCap}
          iconColor={colors.primary}
          iconBgClassName="bg-primary/15"
          active={isRouteActive(pathname, '/(tabs)')}
          onPress={() => goTo('/(tabs)')}
        />
        <AppDrawerItem
          title="Progreso"
          description="Avance y actividad reciente"
          icon={ChartColumn}
          iconColor="#60A5FA"
          iconBgClassName="bg-[#60A5FA]/20"
          active={isRouteActive(pathname, '/(tabs)/progress')}
          onPress={() => goTo('/(tabs)/progress')}
        />
        <AppDrawerItem
          title="Mi espacio"
          description="Perfil, tema y preferencias"
          icon={UserRound}
          iconColor="#A78BFA"
          iconBgClassName="bg-[#A78BFA]/20"
          active={isRouteActive(pathname, '/(tabs)/settings')}
          onPress={() => goTo('/(tabs)/settings')}
        />
      </AppDrawer>
    </>
  );
}
