import { BookOpen, Layers, UserRound } from 'lucide-react-native';

import { AppScreenSection, AppSelect, Row } from '@/design-system';
import { ROLE_SELECT_OPTIONS } from '@/modules/user-preferences';

import type { Difficulty, Subject, UserRole } from '../../domain';
import {
  DIFFICULTY_SELECT_OPTIONS,
  SUBJECT_SELECT_OPTIONS,
} from '../selectOptions';

type SessionFiltersProps = {
  subject: Subject;
  difficulty: Difficulty;
  role: UserRole;
  onSubjectChange: (value: Subject) => void;
  onDifficultyChange: (value: Difficulty) => void;
  onRoleChange: (value: UserRole) => void;
  disabled?: boolean;
};

export function SessionFilters({
  subject,
  difficulty,
  role,
  onSubjectChange,
  onDifficultyChange,
  onRoleChange,
  disabled,
}: SessionFiltersProps) {
  return (
    <AppScreenSection>
      <Row gap="sm">
        <AppSelect
          label="Materia"
          icon={BookOpen}
          value={subject}
          options={SUBJECT_SELECT_OPTIONS}
          onChange={onSubjectChange}
          disabled={disabled}
        />
        <AppSelect
          label="Dificultad"
          icon={Layers}
          value={difficulty}
          options={DIFFICULTY_SELECT_OPTIONS}
          onChange={onDifficultyChange}
          disabled={disabled}
        />
        <AppSelect
          label="Rol"
          icon={UserRound}
          value={role}
          options={ROLE_SELECT_OPTIONS}
          onChange={onRoleChange}
          disabled={disabled}
        />
      </Row>
    </AppScreenSection>
  );
}
