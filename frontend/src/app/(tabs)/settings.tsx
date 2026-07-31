import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Box, Stack } from '@/design-system';

/** Placeholder — user-preferences module screen will mount here (Day 5). */
export default function ProfileScreen() {
  return (
    <Box className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack gap="sm" className="px-6 pt-6">
          <AppText variant="subtitle">Perfil</AppText>
          <AppText tone="muted">
            Aquí irán preferencias, rol y tema.
          </AppText>
        </Stack>
      </SafeAreaView>
    </Box>
  );
}
