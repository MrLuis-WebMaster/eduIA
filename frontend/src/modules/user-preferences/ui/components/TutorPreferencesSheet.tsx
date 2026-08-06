import { useState } from 'react';
import {
  Atom,
  BookOpen,
  Briefcase,
  Calculator,
  CircleDot,
  Ellipsis,
  Flame,
  HandHeart,
  Landmark,
  Lightbulb,
  ListTree,
  MessageCircleQuestion,
  Smile,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import {
  AppBottomSheet,
  AppButton,
  AppSelectableOption,
  AppText,
  Stack,
} from '@/design-system';

import {
  LEVEL_OPTIONS,
  PERSONALITY_OPTIONS,
  STYLE_OPTIONS,
  SUBJECT_OPTIONS,
  WEEKLY_QUESTION_GOAL_OPTIONS,
  type ExplanationStyle,
  type FavoriteSubject,
  type PreferredLevel,
  type TutorPersonality,
  type UserPreferences,
} from '../../domain';

type TutorPreferencesSheetProps = {
  visible: boolean;
  prefs: UserPreferences;
  saving: boolean;
  onClose: () => void;
  onSave: (patch: {
    preferredLevel: PreferredLevel;
    favoriteSubjects: FavoriteSubject[];
    explanationStyle: ExplanationStyle;
    tutorPersonality: TutorPersonality;
    weeklyQuestionGoal: number;
  }) => Promise<void>;
};

const LEVEL_META: Record<
  PreferredLevel,
  { icon: LucideIcon; description: string }
> = {
  basic: {
    icon: CircleDot,
    description: 'Fundamentos claros y paso a paso',
  },
  intermediate: {
    icon: Zap,
    description: 'Práctica con un poco más de reto',
  },
  advanced: {
    icon: Sparkles,
    description: 'Profundiza y conecta ideas complejas',
  },
};

const SUBJECT_META: Record<
  FavoriteSubject,
  { icon: LucideIcon; description: string }
> = {
  math: {
    icon: Calculator,
    description: 'Álgebra, geometría, cálculo y más',
  },
  science: {
    icon: Atom,
    description: 'Física, química y biología',
  },
  language: {
    icon: BookOpen,
    description: 'Lectura, escritura y gramática',
  },
  history: {
    icon: Landmark,
    description: 'Hechos, contextos y análisis',
  },
  other: {
    icon: Ellipsis,
    description: 'Cualquier otro tema de estudio',
  },
};

const STYLE_META: Record<
  ExplanationStyle,
  { icon: LucideIcon; description: string }
> = {
  simple: {
    icon: Lightbulb,
    description: 'Explicaciones cortas y directas',
  },
  detailed: {
    icon: ListTree,
    description: 'Más contexto, ejemplos y matices',
  },
  socratic: {
    icon: MessageCircleQuestion,
    description: 'Preguntas guía para que descubras la respuesta',
  },
};

const PERSONALITY_ICONS: Record<TutorPersonality, LucideIcon> = {
  friendly: Smile,
  formal: Briefcase,
  motivating: Flame,
  patient: HandHeart,
  direct: Target,
};

export function TutorPreferencesSheet({
  visible,
  prefs,
  saving,
  onClose,
  onSave,
}: TutorPreferencesSheetProps) {
  const [preferredLevel, setPreferredLevel] = useState(prefs.preferredLevel);
  const [favoriteSubjects, setFavoriteSubjects] = useState(prefs.favoriteSubjects);
  const [explanationStyle, setExplanationStyle] = useState(prefs.explanationStyle);
  const [tutorPersonality, setTutorPersonality] = useState(prefs.tutorPersonality);
  const [weeklyQuestionGoal, setWeeklyQuestionGoal] = useState(
    prefs.weeklyQuestionGoal,
  );
  const [prevVisible, setPrevVisible] = useState(visible);

  // Reset draft fields when the sheet opens (avoid syncing via useEffect).
  if (visible !== prevVisible) {
    setPrevVisible(visible);
    if (visible) {
      setPreferredLevel(prefs.preferredLevel);
      setFavoriteSubjects(prefs.favoriteSubjects);
      setExplanationStyle(prefs.explanationStyle);
      setTutorPersonality(prefs.tutorPersonality);
      setWeeklyQuestionGoal(prefs.weeklyQuestionGoal);
    }
  }

  const dirty =
    preferredLevel !== prefs.preferredLevel ||
    explanationStyle !== prefs.explanationStyle ||
    tutorPersonality !== prefs.tutorPersonality ||
    weeklyQuestionGoal !== prefs.weeklyQuestionGoal ||
    !sameSubjects(favoriteSubjects, prefs.favoriteSubjects);

  return (
    <AppBottomSheet
      visible={visible}
      title="Preferencias del tutor"
      onClose={onClose}
      accessibilityLabel="Preferencias del tutor"
      footer={
        <AppButton
          label="Guardar"
          loading={saving}
          disabled={saving || !dirty}
          fullWidth
          onPress={() => {
            void onSave({
              preferredLevel,
              favoriteSubjects,
              explanationStyle,
              tutorPersonality,
              weeklyQuestionGoal,
            });
          }}
        />
      }
    >
      <Stack gap="lg" className="pb-2">
        <Stack gap="sm">
          <AppText variant="label">Nivel preferido</AppText>
          <Stack gap="sm">
            {LEVEL_OPTIONS.map((option) => {
              const meta = LEVEL_META[option.value];
              return (
                <AppSelectableOption
                  key={option.value}
                  label={option.label}
                  description={meta.description}
                  icon={meta.icon}
                  selected={preferredLevel === option.value}
                  disabled={saving}
                  onPress={() => setPreferredLevel(option.value)}
                />
              );
            })}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <AppText variant="label">Materias favoritas</AppText>
          <AppText variant="caption" tone="muted">
            Puedes elegir más de una
          </AppText>
          <Stack gap="sm">
            {SUBJECT_OPTIONS.map((option) => {
              const meta = SUBJECT_META[option.value];
              const selected = favoriteSubjects.includes(option.value);
              return (
                <AppSelectableOption
                  key={option.value}
                  label={option.label}
                  description={meta.description}
                  icon={meta.icon}
                  selected={selected}
                  disabled={saving}
                  onPress={() =>
                    setFavoriteSubjects((current) =>
                      toggleSubject(current, option.value),
                    )
                  }
                />
              );
            })}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <AppText variant="label">Meta semanal</AppText>
          <AppText variant="caption" tone="muted">
            Preguntas al Tutor por semana (se guarda en este dispositivo)
          </AppText>
          <Stack gap="sm">
            {WEEKLY_QUESTION_GOAL_OPTIONS.map((option) => (
              <AppSelectableOption
                key={option.value}
                label={option.label}
                description={option.description}
                icon={Target}
                selected={weeklyQuestionGoal === option.value}
                disabled={saving}
                onPress={() => setWeeklyQuestionGoal(option.value)}
              />
            ))}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <AppText variant="label">Personalidad del tutor</AppText>
          <Stack gap="sm">
            {PERSONALITY_OPTIONS.map((option) => (
              <AppSelectableOption
                key={option.value}
                label={option.label}
                description={option.description}
                icon={PERSONALITY_ICONS[option.value]}
                selected={tutorPersonality === option.value}
                disabled={saving}
                onPress={() => setTutorPersonality(option.value)}
              />
            ))}
          </Stack>
        </Stack>

        <Stack gap="sm">
          <AppText variant="label">Estilo de explicación</AppText>
          <Stack gap="sm">
            {STYLE_OPTIONS.map((option) => {
              const meta = STYLE_META[option.value];
              return (
                <AppSelectableOption
                  key={option.value}
                  label={option.label}
                  description={meta.description}
                  icon={meta.icon}
                  selected={explanationStyle === option.value}
                  disabled={saving}
                  onPress={() => setExplanationStyle(option.value)}
                />
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </AppBottomSheet>
  );
}

function toggleSubject(
  current: FavoriteSubject[],
  subject: FavoriteSubject,
): FavoriteSubject[] {
  return current.includes(subject)
    ? current.filter((s) => s !== subject)
    : [...current, subject];
}

function sameSubjects(a: FavoriteSubject[], b: FavoriteSubject[]): boolean {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  return b.every((item) => set.has(item));
}
