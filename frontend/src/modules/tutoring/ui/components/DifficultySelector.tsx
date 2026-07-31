import { AppSegmentedControl, AppText, Stack } from '@/design-system';

import { DIFFICULTY_OPTIONS, type Difficulty } from '../../domain';

type DifficultySelectorProps = {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
  disabled?: boolean;
};

export function DifficultySelector({
  value,
  onChange,
  disabled,
}: DifficultySelectorProps) {
  return (
    <Stack gap="xs" className="px-4">
      <AppText variant="label" tone="muted">
        Dificultad
      </AppText>
      <AppSegmentedControl
        options={DIFFICULTY_OPTIONS}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </Stack>
  );
}
