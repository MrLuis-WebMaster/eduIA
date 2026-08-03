import { useEffect, useState } from 'react';
import { Target } from 'lucide-react-native';

import {
  AppBottomSheet,
  AppButton,
  AppSelectableOption,
  AppText,
  Stack,
} from '@/design-system';
import {
  WEEKLY_QUESTION_GOAL_OPTIONS,
} from '@/modules/user-preferences';

type WeeklyGoalSheetProps = {
  visible: boolean;
  currentGoal: number;
  saving: boolean;
  onClose: () => void;
  onSave: (goal: number) => Promise<void>;
};

export function WeeklyGoalSheet({
  visible,
  currentGoal,
  saving,
  onClose,
  onSave,
}: WeeklyGoalSheetProps) {
  const [goal, setGoal] = useState(currentGoal);

  useEffect(() => {
    if (visible) setGoal(currentGoal);
  }, [visible, currentGoal]);

  const dirty = goal !== currentGoal;

  return (
    <AppBottomSheet
      visible={visible}
      title="Meta semanal"
      onClose={onClose}
      accessibilityLabel="Elegir meta semanal de preguntas"
      footer={
        <AppButton
          label="Guardar meta"
          loading={saving}
          disabled={saving || !dirty}
          fullWidth
          onPress={() => {
            void onSave(goal);
          }}
        />
      }>
      <Stack gap="md" className="pb-2">
        <AppText variant="caption" tone="muted">
          Elige cuántas preguntas quieres hacerle al Tutor cada semana. Se guarda
          en este dispositivo.
        </AppText>
        <Stack gap="sm">
          {WEEKLY_QUESTION_GOAL_OPTIONS.map((option) => (
            <AppSelectableOption
              key={option.value}
              label={option.label}
              description={option.description}
              icon={Target}
              selected={goal === option.value}
              disabled={saving}
              onPress={() => setGoal(option.value)}
            />
          ))}
        </Stack>
      </Stack>
    </AppBottomSheet>
  );
}
