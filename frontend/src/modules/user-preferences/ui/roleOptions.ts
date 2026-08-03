import { GraduationCap, UserRound } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

import type { AppSelectOption } from '@/design-system';

import type { UserRole } from '../domain';

/** Shared role choices for Tutor filters and Mi espacio profile. */
export const ROLE_SELECT_OPTIONS: (AppSelectOption<UserRole> & {
  icon: LucideIcon;
  description: string;
})[] = [
  {
    value: 'student',
    label: 'Estudiante',
    description: 'Aprende con explicaciones a tu ritmo',
    icon: UserRound,
  },
  {
    value: 'teacher',
    label: 'Docente',
    description: 'Prepara clases y recursos con el tutor',
    icon: GraduationCap,
  },
];
