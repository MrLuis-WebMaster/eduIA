/** React Query keys for tutoring — kept free of hooks to avoid require cycles. */

export const TUTOR_SESSION_QUERY_KEY = ['tutoring', 'session'] as const;

export const RECENT_TUTORING_SESSIONS_QUERY_KEY = [
  'tutoring',
  'recent-sessions',
] as const;
