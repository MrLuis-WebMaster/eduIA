import { Alert, View } from 'react-native';
import {
  Atom,
  BookOpen,
  Calculator,
  Ellipsis,
  Landmark,
  MessageSquareText,
  Trash2,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import {
  AppBottomSheet,
  AppButton,
  AppEmptyState,
  AppSpinner,
  AppText,
  Row,
  Stack,
  useTheme,
} from '@/design-system';
import {
  useRecentTutoringSessions,
  type Subject,
} from '@/modules/tutoring';
import { DIFFICULTY_LABELS } from '@/shared/domain/tutor-profile';
import { formatRelativeDay } from '@/shared/utils';

type ConversationsSheetProps = {
  visible: boolean;
  clearingHistory: boolean;
  onClose: () => void;
  onClearHistory: () => Promise<void>;
};

const SUBJECT_ICONS: Record<Subject, LucideIcon> = {
  math: Calculator,
  science: Atom,
  language: BookOpen,
  history: Landmark,
  other: Ellipsis,
};

export function ConversationsSheet({
  visible,
  clearingHistory,
  onClose,
  onClearHistory,
}: ConversationsSheetProps) {
  const { colors } = useTheme();
  const sessionsQuery = useRecentTutoringSessions(30);
  const sessions = sessionsQuery.data ?? [];

  return (
    <AppBottomSheet
      visible={visible}
      title="Conversaciones"
      onClose={onClose}
      accessibilityLabel="Historial de conversaciones"
      footer={
        <Stack gap="sm">
          <AppButton
            label="Borrar todo el historial"
            variant="outline"
            icon={Trash2}
            loading={clearingHistory}
            disabled={clearingHistory || sessions.length === 0}
            fullWidth
            className="border-danger"
            onPress={() => {
              Alert.alert(
                'Borrar historial',
                'Esta acción eliminará todas tus conversaciones de forma permanente.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Borrar todo',
                    style: 'destructive',
                    onPress: () => {
                      void onClearHistory();
                    },
                  },
                ],
              );
            }}
          />
          <AppText variant="caption" tone="muted" className="text-center">
            Esta acción eliminará todas tus conversaciones de forma permanente.
          </AppText>
        </Stack>
      }>
      {sessionsQuery.isLoading ? (
        <AppSpinner label="Cargando conversaciones…" />
      ) : sessions.length === 0 ? (
        <AppEmptyState
          title="Sin conversaciones"
          description="Cuando hables con el Tutor, aparecerán aquí."
          compact
        />
      ) : (
        <Stack gap="sm" className="pb-2">
          {sessions.map((session) => {
            const Icon = SUBJECT_ICONS[session.subject] ?? MessageSquareText;
            const levelLabel =
              DIFFICULTY_LABELS[session.difficulty] ?? session.difficulty;
            const title =
              session.firstQuestion?.trim() ||
              `Sesión de ${session.subjectLabel}`;

            return (
              <View
                key={session.id}
                className="rounded-xl border border-border bg-background-secondary px-3 py-3">
                <Row align="start" gap="md">
                  <View className="mt-0.5 h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                    <Icon size={18} color={colors.primary} strokeWidth={2} />
                  </View>
                  <Stack gap="none" className="min-w-0 flex-1">
                    <AppText variant="label" numberOfLines={2}>
                      {title}
                    </AppText>
                    <AppText variant="caption" tone="muted">
                      {session.subjectLabel} · {levelLabel}
                    </AppText>
                  </Stack>
                  <AppText variant="caption" tone="muted">
                    {formatRelativeDay(session.updatedAt)}
                  </AppText>
                </Row>
              </View>
            );
          })}
        </Stack>
      )}
    </AppBottomSheet>
  );
}
