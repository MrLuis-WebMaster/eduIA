/** App-wide runtime config. */

export type TutorMode = 'remote' | 'fake';

export type AppConfig = {
  apiUrl: string;
  tutorMode: TutorMode;
  useFakeTutor: boolean;
  requestTimeoutMs: number;
};

export function getAppConfig(): AppConfig {
  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL?.trim() || 'http://localhost:3001';

  const tutorMode = resolveTutorMode();

  return {
    apiUrl,
    tutorMode,
    useFakeTutor: tutorMode === 'fake',
    requestTimeoutMs: 20_000,
  };
}

function resolveTutorMode(): TutorMode {
  const mode = process.env.EXPO_PUBLIC_TUTOR_MODE?.trim().toLowerCase();
  if (mode === 'fake' || mode === 'remote') return mode;

  // Backward-compatible aliases from earlier scaffolding.
  const engine = process.env.EXPO_PUBLIC_TUTOR_ENGINE?.trim().toLowerCase();
  if (engine === 'fake') return 'fake';
  if (engine === 'http' || engine === 'remote') return 'remote';

  const useFake =
    process.env.EXPO_PUBLIC_USE_FAKE_TUTOR === 'true' ||
    process.env.EXPO_PUBLIC_USE_FAKE_TUTOR === '1';
  if (useFake) return 'fake';

  // Safe default for demos / missing .env: no network required.
  return 'fake';
}
