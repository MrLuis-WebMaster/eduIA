import { ScrollView } from 'react-native';

import { AppChip, AppText, Row, Stack } from '@/design-system';

import { SUBJECT_OPTIONS, type Subject } from '../../domain';

type SubjectSelectorProps = {
  value: Subject;
  onChange: (value: Subject) => void;
  disabled?: boolean;
};

export function SubjectSelector({
  value,
  onChange,
  disabled,
}: SubjectSelectorProps) {
  return (
    <Stack gap="xs" className="px-4">
      <AppText variant="label" tone="muted">
        Materia
      </AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Row gap="sm" className="pr-4">
          {SUBJECT_OPTIONS.map((option) => (
            <AppChip
              key={option.value}
              label={option.label}
              selected={option.value === value}
              disabled={disabled}
              onPress={() => onChange(option.value)}
            />
          ))}
        </Row>
      </ScrollView>
    </Stack>
  );
}
