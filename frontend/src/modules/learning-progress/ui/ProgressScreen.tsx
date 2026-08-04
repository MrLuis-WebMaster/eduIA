import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Atom,
  BookOpen,
  Calculator,
  CircleCheck,
  Flame,
  Info,
  Landmark,
  Lightbulb,
  MessageCircle,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import {
  AppButton,
  AppCard,
  AppEmptyState,
  AppErrorState,
  AppScreen,
  AppScreenHeading,
  AppSkeleton,
  AppText,
  Pressable,
  Row,
  Stack,
  cn,
  useTheme,
} from '@/design-system';
import { LEVEL_OPTIONS } from '@/modules/user-preferences/domain';
import { usePreferences } from '@/modules/user-preferences';
import type { Subject } from '@/modules/tutoring/domain';

import type { ProgressSummary, WeeklyActivityDay } from '../domain';
import { ActivityRing } from './components/ActivityRing';
import { WeeklyGoalSheet } from './components/WeeklyGoalSheet';
import { useLearningProgress } from './hooks/useLearningProgress';
import {
  buildAchievements,
  buildSubjectActivityRows,
  firstNameFromDisplayName,
  formatRelativeDay,
  heroCopy,
  weeklyActivityScore,
  type SubjectActivityRow,
} from './progressPresentation';

const SUBJECT_ICONS: Record<Subject, LucideIcon> = {
  math: Calculator,
  science: Atom,
  language: BookOpen,
  history: Landmark,
  other: Lightbulb,
};

export function ProgressScreen() {
  const router = useRouter();
  const {
    role,
    displayName,
    preferredLevel,
    weeklyQuestionGoal,
    summary,
    isLoading,
    isError,
    refetch,
  } = useLearningProgress();
  const {
    prefs,
    saving,
    save,
  } = usePreferences();

  const [goalSheetOpen, setGoalSheetOpen] = useState(false);

  const firstName = useMemo(
    () => firstNameFromDisplayName(displayName),
    [displayName],
  );
  const weekly = useMemo(
    () => weeklyActivityScore(summary, weeklyQuestionGoal),
    [summary, weeklyQuestionGoal],
  );
  const subjectRows = useMemo(
    () => buildSubjectActivityRows(summary.progressBySubject),
    [summary.progressBySubject],
  );
  const achievements = useMemo(() => buildAchievements(summary), [summary]);
  const hero = useMemo(
    () => heroCopy(summary, firstName),
    [summary, firstName],
  );
  const preferredLevelLabel =
    LEVEL_OPTIONS.find((o) => o.value === preferredLevel)?.label ??
    preferredLevel;

  const goToTutor = () => {
    router.push('/(tabs)');
  };

  const openGoalSheet = () => {
    setGoalSheetOpen(true);
  };

  if (isLoading) {
    return (
      <AppScreen>
        <AppSkeleton height={32} width={160} />
        <AppSkeleton height={140} width="100%" />
        <AppSkeleton height={72} width="100%" />
        <AppSkeleton height={160} width="100%" />
      </AppScreen>
    );
  }

  if (isError) {
    return (
      <AppScreen padded={false}>
        <AppErrorState
          fill
          title="No se pudo cargar el progreso"
          message="Revisa el historial local e inténtalo de nuevo."
          retryLabel="Reintentar"
          onRetry={() => {
            void refetch();
          }}
        />
      </AppScreen>
    );
  }

  const isEmpty = summary.sessionCount === 0;

  return (
    <AppScreen scroll accessibilityLabel="Progreso de aprendizaje">
      <AppScreenHeading
        title="Progreso"
        description="Tu aprendizaje, resumido y pensado para ti."
      />

      <HeroCard
        title={hero.title}
        body={hero.body}
        weeklyPercent={weekly.percent}
        weeklyTitle={weekly.title}
        weeklyLabel={weekly.label}
        weeklyDetail={weekly.detail}
        onContinue={goToTutor}
        onEditGoal={openGoalSheet}
        continueLabel={isEmpty ? 'Empezar con el Tutor' : 'Continuar aprendiendo'}
      />

      {isEmpty ? (
        <AppEmptyState
          title="Aún no hay actividad"
          description="Habla con el Tutor para registrar sesiones, rachas y materias."
          compact
        />
      ) : (
        <>
          <QuickStats summary={summary} />

          <Stack gap="sm">
            <SubjectActivityCard rows={subjectRows} />
            <WeeklyHeatmap days={summary.weeklyActivity} />
          </Stack>

          <Row gap="sm" align="stretch" className="w-full">
            <ReinforceCard
              topic={summary.topicsToReinforce[0] ?? null}
              onPress={goToTutor}
            />
            <GoalCard
              streakDays={summary.streakDays}
              preferredLevelLabel={preferredLevelLabel}
              weeklyPercent={weekly.percent}
              weeklyTarget={weekly.target}
              onEditGoal={openGoalSheet}
            />
          </Row>

          {role === 'teacher' ? (
            <TeacherInsights summary={summary} />
          ) : (
            <InsightsCard items={summary.recommendations} onPress={goToTutor} />
          )}

          <RecentTimeline items={summary.recentItems} />

          <AchievementsRow items={achievements} />

          <RecommendationCard
            subjectLabel={
              summary.topicsToReinforce[0] ?? summary.topSubjectLabel
            }
            onPress={goToTutor}
          />
        </>
      )}

      <WeeklyGoalSheet
        visible={goalSheetOpen}
        currentGoal={weeklyQuestionGoal}
        saving={saving}
        onClose={() => {
          setGoalSheetOpen(false);
        }}
        onSave={async (goal) => {
          setGoalSheetOpen(false);
          await save(
            { ...prefs, weeklyQuestionGoal: goal },
            { statusMessage: `Guardado — Meta de ${goal} preguntas/semana` },
          );
        }}
      />
    </AppScreen>
  );
}

function HeroCard({
  title,
  body,
  weeklyPercent,
  weeklyTitle,
  weeklyLabel,
  weeklyDetail,
  onContinue,
  onEditGoal,
  continueLabel,
}: {
  title: string;
  body: string;
  weeklyPercent: number;
  weeklyTitle: string;
  weeklyLabel: string;
  weeklyDetail: string;
  onContinue: () => void;
  onEditGoal: () => void;
  continueLabel: string;
}) {
  const { colors } = useTheme();

  return (
    <AppCard
      padding="md"
      className="overflow-hidden border-primary/20 bg-primary/5"
      accessibilityLabel={`${title}. ${weeklyDetail}`}>
      <Stack gap="sm">
        <Row align="start" gap="md">
          <Stack gap="sm" className="min-w-0 flex-1">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primary/20">
              <Sparkles size={20} color={colors.primary} strokeWidth={2} />
            </View>
            <AppText variant="subtitle">{title}</AppText>
            <AppText variant="caption" tone="muted">
              {body}
            </AppText>
            <AppButton
              label={continueLabel}
              size="sm"
              className="mt-1 self-start"
              onPress={onContinue}
            />
          </Stack>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cambiar meta semanal"
            onPress={onEditGoal}
            className="active:opacity-80">
            <ActivityRing
              percent={weeklyPercent}
              title={weeklyTitle}
              caption={weeklyLabel}
            />
          </Pressable>
        </Row>
        <AppText variant="caption" tone="muted">
          {weeklyDetail}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cambiar meta semanal"
          onPress={onEditGoal}
          className="active:opacity-80">
          <AppText
            variant="caption"
            className="font-semibold text-primary">
            Cambiar meta semanal →
          </AppText>
        </Pressable>
      </Stack>
    </AppCard>
  );
}

function QuickStats({ summary }: { summary: ProgressSummary }) {
  const items = [
    {
      label: 'Sesiones',
      value: String(summary.sessionCount),
      icon: BookOpen,
      color: '#A78BFA',
    },
    {
      label: 'Preguntas',
      value: String(summary.questionCount),
      icon: MessageCircle,
      color: '#60A5FA',
    },
    {
      label: 'Racha',
      value:
        summary.streakDays > 0
          ? `${summary.streakDays} día${summary.streakDays === 1 ? '' : 's'}`
          : '0',
      hint: summary.streakDays >= 2 ? '¡Sigue así!' : undefined,
      icon: Flame,
      color: '#FB923C',
    },
    {
      label: 'Nivel más usado',
      value: summary.mostUsedLevelLabel ?? '—',
      icon: Target,
      color: '#34D399',
    },
  ];

  return (
    <Row gap="sm" wrap>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <AppCard
            key={item.label}
            variant="muted"
            padding="sm"
            className="min-w-[46%] flex-1"
            accessibilityLabel={`${item.label}: ${item.value}`}>
            <Row align="center" gap="xs" className="mb-1.5">
              <Icon size={14} color={item.color} strokeWidth={2} />
              <AppText variant="caption" tone="muted" numberOfLines={1}>
                {item.label}
              </AppText>
            </Row>
            <AppText variant="subtitle" numberOfLines={1}>
              {item.value}
            </AppText>
            {item.hint ? (
              <AppText
                variant="caption"
                className="mt-0.5 text-primary">
                {item.hint}
              </AppText>
            ) : (
              <AppText variant="caption" tone="muted" className="mt-0.5 opacity-0">
                —
              </AppText>
            )}
          </AppCard>
        );
      })}
    </Row>
  );
}

function SubjectActivityCard({ rows }: { rows: SubjectActivityRow[] }) {
  const { colors } = useTheme();

  return (
    <AppCard accessibilityLabel="Actividad por materia">
      <Stack gap="md">
        <AppText variant="label">Actividad por materia</AppText>
        {rows.length === 0 ? (
          <AppText variant="caption" tone="muted">
            Sin datos aún
          </AppText>
        ) : (
          rows.map((row) => {
            const Icon = SUBJECT_ICONS[row.subject as Subject] ?? Lightbulb;
            const barColor =
              row.status === 'strong'
                ? colors.primary
                : row.status === 'practice'
                  ? '#FB923C'
                  : colors.danger;

            return (
              <Stack key={row.subject} gap="xs">
                <Row align="center" justify="between" gap="sm">
                  <Row align="center" gap="sm" className="min-w-0 flex-1">
                    <Icon size={16} color={barColor} strokeWidth={2} />
                    <AppText variant="label" numberOfLines={1}>
                      {row.label}
                    </AppText>
                  </Row>
                  <AppText variant="caption" tone="muted">
                    {row.relativePct}%
                  </AppText>
                </Row>
                <View className="h-2 overflow-hidden rounded-full bg-background-secondary">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(row.relativePct, 4)}%`,
                      backgroundColor: barColor,
                    }}
                  />
                </View>
                <AppText variant="caption" tone="muted">
                  {row.statusLabel} · {row.questionCount} preg. · {row.sessionCount}{' '}
                  ses.
                </AppText>
              </Stack>
            );
          })
        )}
      </Stack>
    </AppCard>
  );
}

function WeeklyHeatmap({ days }: { days: WeeklyActivityDay[] }) {
  const { colors } = useTheme();
  const max = Math.max(1, ...days.map((d) => d.questionCount));

  return (
    <AppCard accessibilityLabel="Actividad semanal">
      <Stack gap="md">
        <AppText variant="label">Actividad semanal</AppText>
        <Row gap="sm" justify="between">
          {days.map((day) => {
            const intensity = day.questionCount / max;
            const opacity =
              day.questionCount === 0 ? 0.18 : 0.35 + intensity * 0.65;
            return (
              <Stack key={day.date} align="center" gap="xs" className="flex-1">
                <View
                  accessibilityLabel={`${day.label}: ${day.questionCount} preguntas`}
                  className="aspect-square w-full max-w-[36px] rounded-md"
                  style={{
                    backgroundColor: colors.primary,
                    opacity,
                  }}
                />
                <AppText variant="caption" tone="muted">
                  {day.label.charAt(0)}
                </AppText>
              </Stack>
            );
          })}
        </Row>
        <Row align="center" gap="xs">
          <AppText variant="caption" tone="muted">
            Menos
          </AppText>
          {[0.18, 0.4, 0.65, 0.9].map((opacity) => (
            <View
              key={opacity}
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: colors.primary, opacity }}
            />
          ))}
          <AppText variant="caption" tone="muted">
            Más
          </AppText>
        </Row>
      </Stack>
    </AppCard>
  );
}

function ReinforceCard({
  topic,
  onPress,
}: {
  topic: string | null;
  onPress: () => void;
}) {
  return (
    <AppCard
      padding="sm"
      className="min-w-0 flex-1 border-warning/40"
      accessibilityLabel="Necesitas reforzar">
      <Stack gap="sm" className="min-h-[120px] justify-between">
        <Stack gap="xs">
          <AppText variant="caption" tone="muted">
            Necesitas reforzar
          </AppText>
          <AppText variant="label" numberOfLines={2}>
            {topic ?? 'Nada pendiente'}
          </AppText>
        </Stack>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Practicar ahora"
          onPress={onPress}
          className="active:opacity-80">
          <AppText
            variant="caption"
            className="font-semibold text-primary">
            Practicar ahora →
          </AppText>
        </Pressable>
      </Stack>
    </AppCard>
  );
}

function GoalCard({
  streakDays,
  preferredLevelLabel,
  weeklyPercent,
  weeklyTarget,
  onEditGoal,
}: {
  streakDays: number;
  preferredLevelLabel: string;
  weeklyPercent: number;
  weeklyTarget: number;
  onEditGoal: () => void;
}) {
  const goalLabel =
    streakDays >= 3
      ? `Mantén tu racha (${streakDays}d)`
      : `Alcanza nivel ${preferredLevelLabel}`;
  const fill = Math.max(0, Math.min(100, weeklyPercent));

  return (
    <AppCard
      padding="sm"
      className="min-w-0 flex-1 border-primary/40"
      accessibilityLabel="Próximo objetivo">
      <Stack gap="sm" className="min-h-[120px] justify-between">
        <Stack gap="xs">
          <AppText variant="caption" tone="muted">
            Próximo objetivo
          </AppText>
          <AppText variant="label" numberOfLines={2}>
            {goalLabel}
          </AppText>
        </Stack>
        <Stack gap="xs">
          <View className="h-2 w-full overflow-hidden rounded-full border border-border bg-background-secondary">
            <View
              className="h-full rounded-full bg-primary"
              style={{ width: `${fill}%` }}
            />
          </View>
          <AppText variant="caption" tone="muted">
            {fill}% · meta {weeklyTarget} preguntas/semana
          </AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cambiar meta"
            onPress={onEditGoal}
            className="active:opacity-80">
            <AppText
              variant="caption"
              className="font-semibold text-primary">
              Cambiar meta →
            </AppText>
          </Pressable>
        </Stack>
      </Stack>
    </AppCard>
  );
}

function InsightsCard({
  items,
  onPress,
}: {
  items: string[];
  onPress: () => void;
}) {
  const { colors } = useTheme();

  return (
    <AppCard accessibilityLabel="Insights de EduIA">
      <Stack gap="sm">
        <AppText variant="label">Insights de EduIA</AppText>
        {items.length === 0 ? (
          <AppText variant="caption" tone="muted">
            Sin sugerencias todavía
          </AppText>
        ) : (
          items.map((item, index) => (
            <Row key={item} align="start" gap="sm">
              {index === 0 ? (
                <CircleCheck size={16} color={colors.primary} strokeWidth={2} />
              ) : (
                <Info size={16} color={colors.foregroundMuted} strokeWidth={2} />
              )}
              <AppText variant="caption" className="min-w-0 flex-1">
                {item}
              </AppText>
            </Row>
          ))
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver recomendaciones"
          onPress={onPress}
          className="active:opacity-80">
          <AppText
            variant="caption"
            className="font-semibold text-primary">
            Ver recomendaciones →
          </AppText>
        </Pressable>
      </Stack>
    </AppCard>
  );
}

function TeacherInsights({ summary }: { summary: ProgressSummary }) {
  const items = [
    ...summary.teacherResources.slice(0, 2),
    ...summary.teacherActivities.slice(0, 1),
  ];

  return (
    <AppCard accessibilityLabel="Ideas para clase">
      <Stack gap="sm">
        <AppText variant="label">Ideas para clase</AppText>
        {items.length === 0 ? (
          <AppText variant="caption" tone="muted">
            Genera explicaciones en el Tutor para ver sugerencias.
          </AppText>
        ) : (
          items.map((item) => (
            <AppText key={item} variant="caption">
              • {item}
            </AppText>
          ))
        )}
      </Stack>
    </AppCard>
  );
}

function RecentTimeline({
  items,
}: {
  items: ProgressSummary['recentItems'];
}) {
  return (
    <AppCard accessibilityLabel="Actividad reciente">
      <Stack gap="sm">
        <AppText variant="label">Actividad reciente</AppText>
        {items.length === 0 ? (
          <AppText variant="caption" tone="muted">
            Sin sesiones recientes
          </AppText>
        ) : (
          items.slice(0, 5).map((item, index) => (
            <Row key={item.id} align="start" gap="md">
              <Stack align="center" gap="none" className="w-4">
                <View className="h-2.5 w-2.5 rounded-full bg-primary" />
                {index < Math.min(items.length, 5) - 1 ? (
                  <View
                    className="mt-1 w-px flex-1 bg-border"
                    style={{ minHeight: 28 }}
                  />
                ) : null}
              </Stack>
              <Stack gap="none" className="min-w-0 flex-1 pb-2">
                <Row align="center" justify="between" gap="sm">
                  <AppText variant="label" numberOfLines={1} className="min-w-0 flex-1">
                    {item.title}
                  </AppText>
                  <AppText variant="caption" tone="muted">
                    {formatRelativeDay(item.updatedAt)}
                  </AppText>
                </Row>
                <AppText variant="caption" tone="muted" numberOfLines={1}>
                  {item.subtitle}
                </AppText>
              </Stack>
            </Row>
          ))
        )}
      </Stack>
    </AppCard>
  );
}

function AchievementsRow({
  items,
}: {
  items: ReturnType<typeof buildAchievements>;
}) {
  const { colors } = useTheme();

  return (
    <AppCard accessibilityLabel="Logros">
      <Stack gap="sm">
        <Row align="center" gap="xs">
          <Trophy size={16} color={colors.primary} strokeWidth={2} />
          <AppText variant="label">Logros</AppText>
        </Row>
        <Row gap="sm" align="start" className="justify-between">
          {items.map((item) => (
            <Stack
              key={item.id}
              align="center"
              gap="xs"
              className="w-[23%] max-w-[23%]"
              accessibilityLabel={`${item.label}: ${item.unlocked ? 'desbloqueado' : `${Math.round(item.progress * 100)}%`}`}>
              <View
                className={cn(
                  'h-12 w-12 items-center justify-center rounded-2xl border',
                  item.unlocked
                    ? 'border-primary bg-primary/15'
                    : 'border-border bg-background-secondary',
                )}>
                <Trophy
                  size={18}
                  color={
                    item.unlocked ? colors.primary : colors.foregroundMuted
                  }
                  strokeWidth={2}
                />
              </View>
              <View className="h-8 w-full justify-start">
                <AppText
                  variant="caption"
                  className="text-center"
                  numberOfLines={2}>
                  {item.label}
                </AppText>
              </View>
              <View className="h-1 w-10 overflow-hidden rounded-full bg-border">
                {item.unlocked ? (
                  <View className="h-full w-full rounded-full bg-primary" />
                ) : (
                  <View
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(item.progress * 100, 6)}%` }}
                  />
                )}
              </View>
            </Stack>
          ))}
        </Row>
      </Stack>
    </AppCard>
  );
}

function RecommendationCard({
  subjectLabel,
  onPress,
}: {
  subjectLabel: string | null;
  onPress: () => void;
}) {
  return (
    <AppCard
      padding="md"
      className="border-chat-user/30 bg-chat-user/10"
      accessibilityLabel="Recomendación para ti">
      <Stack gap="sm">
        <AppText variant="label">Recomendación para ti</AppText>
        <AppText variant="caption" tone="muted">
          {subjectLabel
            ? `Practica ${subjectLabel} con una explicación o un ejemplo en el Tutor.`
            : 'Abre el Tutor y elige una materia para tu próxima sesión.'}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Comenzar ahora"
          onPress={onPress}
          className="active:opacity-80">
          <AppText
            variant="caption"
            className="font-semibold text-primary">
            Comenzar ahora →
          </AppText>
        </Pressable>
      </Stack>
    </AppCard>
  );
}
