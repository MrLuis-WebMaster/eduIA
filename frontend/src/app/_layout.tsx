import '@/global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

import { AppProviders } from '@/bootstrap';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppProviders>
  );
}
