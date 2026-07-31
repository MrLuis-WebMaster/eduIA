import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' || scheme == null ? 'light' : scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tutor',
          tabBarLabel: 'Tutor',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarLabel: 'Progreso',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
        }}
      />
    </Tabs>
  );
}
