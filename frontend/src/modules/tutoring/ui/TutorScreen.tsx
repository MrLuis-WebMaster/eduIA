import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppErrorState,
  AppText,
  Box,
  Stack,
} from '@/design-system';
import { usePreferencesStore } from '@/modules/user-preferences';

import { ChatMessageList } from './components/ChatMessageList';
import { DifficultySelector } from './components/DifficultySelector';
import { MessageComposer } from './components/MessageComposer';
import { QuickActions } from './components/QuickActions';
import { SubjectSelector } from './components/SubjectSelector';
import { TutorHeader, TutorRoleHint } from './components/TutorHeader';
import { useTutorSession } from './hooks/useTutorSession';

export function TutorScreen() {
  const prefs = usePreferencesStore((s) => s.prefs);
  const prefsHydrated = usePreferencesStore((s) => s.hydrated);

  const role = prefs.role;
  const displayName =
    prefs.displayName.trim() || (role === 'teacher' ? 'Docente' : 'Estudiante');
  const roleLabel = role === 'teacher' ? 'docente' : 'estudiante';

  const tutor = useTutorSession(role, prefs.preferredLevel);
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
              displayName={prefsHydrated ? displayName : '…'}
              roleLabel={roleLabel}
              onNewSession={tutor.startNewSession}
              newSessionDisabled={busy}
            />
            <TutorRoleHint roleLabel={roleLabel} />

            {tutor.isOffline ? (
              <View className="mx-4 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 dark:border-warning-dark/40 dark:bg-warning-dark/10">
                <AppText variant="caption" tone="warning">
                  Sin conexión — el envío puede fallar hasta que vuelva la red.
                </AppText>
              </View>
            ) : null}

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
              role={role}
              onSelect={tutor.applyQuickAction}
              disabled={busy}
            />

            {tutor.isSendError && tutor.sendErrorMessage ? (
              <View className="mx-4 overflow-hidden rounded-xl border border-danger/30 dark:border-danger-dark/40">
                <AppErrorState
                  compact
                  title={errorTitle(tutor.sendErrorKind)}
                  message={tutor.sendErrorMessage}
                  onRetry={
                    tutor.sendErrorKind === 'cancelled'
                      ? undefined
                      : () => {
                          tutor.retrySend();
                        }
                  }
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
              onCancel={tutor.cancelSend}
              disabled={tutor.isLoadingSession || tutor.isSessionError}
              sending={tutor.isSending}
            />
          </Stack>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Box>
  );
}

function errorTitle(
  kind: ReturnType<typeof useTutorSession>['sendErrorKind'],
): string {
  switch (kind) {
    case 'timeout':
      return 'Tiempo agotado';
    case 'cancelled':
      return 'Cancelado';
    case 'offline':
    case 'network':
      return 'Sin conexión';
    case 'validation':
      return 'Mensaje inválido';
    default:
      return 'No se pudo enviar';
  }
}
