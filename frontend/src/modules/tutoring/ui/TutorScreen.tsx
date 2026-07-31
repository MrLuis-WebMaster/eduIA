import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppErrorState,
  AppText,
  Box,
  Stack,
} from '@/design-system';

import { ChatMessageList } from './components/ChatMessageList';
import { DifficultySelector } from './components/DifficultySelector';
import { MessageComposer } from './components/MessageComposer';
import { QuickActions } from './components/QuickActions';
import { SubjectSelector } from './components/SubjectSelector';
import { TutorHeader, TutorRoleHint } from './components/TutorHeader';
import { useTutorSession } from './hooks/useTutorSession';

const PLACEHOLDER_ROLE: 'student' | 'teacher' = 'student';
const PLACEHOLDER_NAME = 'Luis';

export function TutorScreen() {
  const tutor = useTutorSession(PLACEHOLDER_ROLE);
  const roleLabel = PLACEHOLDER_ROLE === 'teacher' ? 'docente' : 'estudiante';
  const busy = tutor.isSending || tutor.isStartingSession;

  return (
    <Box className="flex-1 bg-background dark:bg-background-dark">
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
          <Stack gap="sm" className="flex-1 pt-2">
            <TutorHeader
              displayName={PLACEHOLDER_NAME}
              roleLabel={roleLabel}
              onNewSession={tutor.startNewSession}
              newSessionDisabled={busy}
            />
            <TutorRoleHint roleLabel={roleLabel} />

            <SubjectSelector
              value={tutor.subject}
              onChange={tutor.setSubject}
              disabled={busy}
            />
            <DifficultySelector
              value={tutor.difficulty}
              onChange={tutor.setDifficulty}
              disabled={busy}
            />
            <QuickActions
              role={PLACEHOLDER_ROLE}
              onSelect={tutor.applyQuickAction}
              disabled={busy}
            />

            {tutor.isSendError && tutor.sendErrorMessage ? (
              <View className="mx-4 overflow-hidden rounded-xl border border-danger/30 dark:border-danger-dark/40">
                <AppErrorState
                  compact
                  title="No se pudo enviar"
                  message={tutor.sendErrorMessage}
                  onRetry={() => {
                    tutor.retrySend();
                  }}
                  retryLabel="Reintentar"
                />
              </View>
            ) : null}

            {tutor.isSendSuccess && !tutor.isSending ? (
              <AppText
                variant="caption"
                tone="success"
                className="px-4"
                accessibilityLiveRegion="polite">
                Respuesta recibida
              </AppText>
            ) : null}

            <Box className="min-h-0 flex-1">
              {tutor.isSessionError ? (
                <AppErrorState
                  message="No se pudo cargar la conversación guardada."
                  onRetry={() => {
                    void tutor.refetchSession();
                  }}
                />
              ) : (
                <ChatMessageList
                  messages={tutor.session?.messages ?? []}
                  isLoading={tutor.isLoadingSession}
                  isSending={tutor.isSending}
                />
              )}
            </Box>

            <MessageComposer
              value={tutor.draft}
              onChange={tutor.setDraft}
              onSend={() => tutor.send()}
              disabled={tutor.isLoadingSession || tutor.isSessionError}
              sending={tutor.isSending}
            />
          </Stack>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Box>
  );
}
