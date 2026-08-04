import { useMemo, useState } from 'react';
import { View } from 'react-native';

import {
  AppErrorState,
  AppScreen,
  AppScreenSection,
  AppText,
  Box,
  layout,
} from '@/design-system';
import { usePreferencesStore } from '@/modules/user-preferences';

import { ChatMessageList } from './components/ChatMessageList';
import { MessageComposer } from './components/MessageComposer';
import { QuickActions, QuickActionsSheet } from './components/QuickActions';
import { SessionFilters } from './components/SessionFilters';
import { TutorSessionBar } from './components/TutorHeader';
import { useTutorSession } from './hooks/useTutorSession';
import { getFollowUpSuggestions, type UserRole } from '../domain';

export function TutorScreen() {
  const prefs = usePreferencesStore((s) => s.prefs);
  const savePrefs = usePreferencesStore((s) => s.save);
  const [actionsOpen, setActionsOpen] = useState(false);

  const role = prefs.role;
  const tutor = useTutorSession(
    role,
    prefs.preferredLevel,
    prefs.explanationStyle,
    prefs.tutorPersonality,
  );
  const busy = tutor.isSending || tutor.isStartingSession;

  const messages = tutor.session?.messages ?? [];
  const hasMessages = messages.length > 0;
  const isEmptyConversation = !hasMessages && !tutor.isSending;

  const followUps = useMemo(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return [];
    return getFollowUpSuggestions(role, last.content);
  }, [messages, role]);

  const showSendErrorBanner =
    tutor.isSendError && Boolean(tutor.sendErrorMessage) && hasMessages;

  const showSendErrorPane =
    !tutor.isSessionError &&
    tutor.isSendError &&
    Boolean(tutor.sendErrorMessage) &&
    !hasMessages &&
    !tutor.isSending &&
    !tutor.isLoadingSession;

  const handleRoleChange = (nextRole: UserRole) => {
    void savePrefs({ ...prefs, role: nextRole });
  };

  const handleQuickAction = (prompt: string) => {
    tutor.applyQuickAction(prompt);
  };

  return (
    <AppScreen
      keyboard
      padded={false}
      gap={layout.gapCompact}
      contentClassName="pt-1"
      footer={
        <MessageComposer
          value={tutor.draft}
          onChange={tutor.setDraft}
          onSend={(message) => {
            if (tutor.isSendError) {
              tutor.clearSendError();
            }
            tutor.send(message);
          }}
          onCancel={tutor.cancelSend}
          onOpenActions={() => setActionsOpen(true)}
          disabled={tutor.isLoadingSession || tutor.isSessionError}
          sending={tutor.isSending}
        />
      }>
      <TutorSessionBar
        onNewSession={tutor.startNewSession}
        newSessionDisabled={busy}
      />

      {tutor.isOffline ? (
        <AppScreenSection>
          <View className="rounded-lg border border-warning/40 bg-warning/10 px-3 py-2">
            <AppText variant="caption" tone="warning">
              Sin conexión — el envío puede fallar hasta que vuelva la red.
            </AppText>
          </View>
        </AppScreenSection>
      ) : null}

      <SessionFilters
        subject={tutor.subject}
        difficulty={tutor.difficulty}
        role={role}
        onSubjectChange={tutor.setSubject}
        onDifficultyChange={tutor.setDifficulty}
        onRoleChange={handleRoleChange}
        disabled={busy}
      />

      {isEmptyConversation ? (
        <QuickActions
          role={role}
          onSelect={handleQuickAction}
          disabled={busy}
        />
      ) : null}

      {showSendErrorBanner ? (
        <AppScreenSection>
          <View className="overflow-hidden rounded-xl border border-danger/30">
            <AppErrorState
              compact
              title={errorTitle(tutor.sendErrorKind)}
              message={tutor.sendErrorMessage!}
              onRetry={() => {
                tutor.retrySend();
              }}
              retryLabel="Reintentar"
            />
          </View>
        </AppScreenSection>
      ) : null}

      <Box className="min-h-0 flex-1">
        {tutor.isSessionError ? (
          <AppErrorState
            fill
            placement="start"
            align="start"
            message="No se pudo cargar la conversación guardada."
            onRetry={() => {
              void tutor.refetchSession();
            }}
          />
        ) : showSendErrorPane ? (
          <AppErrorState
            fill
            placement="start"
            align="start"
            title={errorTitle(tutor.sendErrorKind)}
            message={tutor.sendErrorMessage!}
            onRetry={() => {
              tutor.retrySend();
            }}
            retryLabel="Reintentar"
          />
        ) : (
          <ChatMessageList
            messages={messages}
            isLoading={tutor.isLoadingSession}
            isSending={tutor.isSending}
            followUps={followUps}
            onFollowUpSelect={handleQuickAction}
            followUpsDisabled={busy}
          />
        )}
      </Box>

      <QuickActionsSheet
        role={role}
        visible={actionsOpen}
        onClose={() => setActionsOpen(false)}
        onSelect={handleQuickAction}
      />
    </AppScreen>
  );
}

function errorTitle(
  kind: ReturnType<typeof useTutorSession>['sendErrorKind'],
): string {
  switch (kind) {
    case 'timeout':
      return 'Tiempo agotado';
    case 'offline':
    case 'network':
      return 'Sin conexión';
    case 'validation':
      return 'Mensaje inválido';
    default:
      return 'No se pudo enviar';
  }
}
