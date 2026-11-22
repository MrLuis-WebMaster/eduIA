import { z } from 'zod';

export const sessionSchema = z.object({
  mode: z.enum(['ONLINE', 'ONSITE', 'HYBRID']),
  provider: z.enum(['MEET', 'ZOOM', 'CUSTOM']).nullable().optional(),
  meetingUrl: z.string().url().nullable().optional(),
  location: z.string().trim().min(5).nullable().optional(),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  capacity: z.number().int().positive().max(1000),
}).superRefine((session, ctx) => {
  if (Date.parse(session.startsAt) >= Date.parse(session.endsAt)) {
    ctx.addIssue({ code: 'custom', path: ['endsAt'], message: 'La hora de finalización debe ser posterior al inicio' });
  }
  if (session.mode !== 'ONLINE' && !session.location) {
    ctx.addIssue({ code: 'custom', path: ['location'], message: 'Una clase presencial o híbrida requiere ubicación' });
  }
  if (session.mode !== 'ONSITE' && !session.provider && !session.meetingUrl) {
    ctx.addIssue({ code: 'custom', path: ['provider'], message: 'Una clase virtual o híbrida requiere plataforma o enlace' });
  }
  if (session.provider === 'CUSTOM' && !session.meetingUrl && session.mode !== 'ONSITE') {
    ctx.addIssue({ code: 'custom', path: ['meetingUrl'], message: 'El enlace manual es obligatorio' });
  }
});

export type SessionInput = z.infer<typeof sessionSchema>;
export function validateSession(input: unknown) {
  const result = sessionSchema.safeParse(input);
  return result.success
    ? { valid: true as const, data: result.data }
    : { valid: false as const, errors: result.error.flatten() };
}
