import { z } from 'zod';

export const preferencesFormSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(80, 'Máximo 80 caracteres'),
  role: z.enum(['student', 'teacher']),
  preferredLevel: z.enum(['basic', 'intermediate', 'advanced']),
  favoriteSubjects: z.array(
    z.enum(['math', 'science', 'language', 'history', 'other']),
  ),
  explanationStyle: z.enum(['simple', 'detailed', 'socratic']),
  theme: z.enum(['system', 'light', 'dark']),
});

export type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;
