import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Box, Stack } from '@/design-system';

/** Placeholder — tutoring module screen will mount here (Day 4). */
export default function TutorScreen() {
  return (
    <Box className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <Stack gap="sm" className="px-6 pt-6">
          <AppText variant="subtitle">Tutor</AppText>
          <AppText tone="muted">
            Aquí irá el chat con el tutor de IA.
          </AppText>
        </Stack>
      </SafeAreaView>
    </Box>
  );
}
