import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Box, Stack } from '@/design-system';

/** Placeholder — learning-progress module screen will mount here (Day 6). */
export default function ProgressScreen() {
  return (
    <Box className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack gap="sm" className="px-6 pt-6">
          <AppText variant="subtitle">Progreso</AppText>
          <AppText tone="muted">
            Aquí irán las métricas de aprendizaje local.
          </AppText>
        </Stack>
      </SafeAreaView>
    </Box>
  );
}
