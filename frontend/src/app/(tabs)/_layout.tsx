import { Tabs } from 'expo-router';
import { ChartColumn, GraduationCap, User } from 'lucide-react-native';

import { AppHeader, useTheme } from '@/design-system';
import { usePreferencesStore } from '@/modules/user-preferences';

export default function TabsLayout() {
  const { colors } = useTheme();
  const displayName = usePreferencesStore((s) => s.prefs.displayName);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <AppHeader displayName={displayName} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.foregroundMuted,
        tabBarStyle: { backgroundColor: colors.surface },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tutor',
          tabBarLabel: 'Tutor',
          tabBarIcon: ({ color, size }) => (
            <GraduationCap color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarLabel: 'Progreso',
          tabBarIcon: ({ color, size }) => (
            <ChartColumn color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Mi espacio',
          tabBarLabel: 'Mi espacio',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
