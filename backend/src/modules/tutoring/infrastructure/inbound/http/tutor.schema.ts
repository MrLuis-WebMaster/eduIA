import { z } from 'zod';

export const conversationMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
});

export const tutorMessageBodySchema = z.object({
  message: z
    .string()
    .trim()
    .min(2, 'message must be at least 2 characters')
    .max(2000, 'message must be at most 2000 characters'),
  subject: z
    .string()
    .trim()
    .min(1, 'subject is required')
    .max(100, 'subject must be at most 100 characters'),
  difficulty: z.enum(['basic', 'intermediate', 'advanced']),
  userRole: z.enum(['student', 'teacher']),
  explanationStyle: z
    .enum(['simple', 'detailed', 'socratic'])
    .default('simple'),
  tutorPersonality: z
    .enum(['friendly', 'formal', 'motivating', 'patient', 'direct'])
    .default('friendly'),
  conversation: z
    .array(conversationMessageSchema)
    .max(10, 'conversation may contain at most 10 messages')
    .default([]),
});

export type TutorMessageBody = z.infer<typeof tutorMessageBodySchema>;

/** Success body for POST /api/v1/tutor/messages (OpenAPI + docs). */
export const tutorMessageResponseSchema = z.object({
  reply: z.string(),
  provider: z.string(),
  model: z.string().nullable(),
  requestId: z.string(),
});

export type TutorMessageResponse = z.infer<typeof tutorMessageResponseSchema>;

/** Normalized API error envelope. */
export const apiErrorBodySchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean(),
    requestId: z.string(),
  }),
});

export type ApiErrorBody = z.infer<typeof apiErrorBodySchema>;
