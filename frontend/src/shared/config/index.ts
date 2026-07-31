/** App-wide config stubs. */

export type AppConfig = {
  apiUrl: string;
  useFakeTutor: boolean;
  requestTimeoutMs: number;
};

export function getAppConfig(): AppConfig {
  const apiUrl =
    process.env.EXPO_PUBLIC_API_URL?.trim() || 'http://localhost:3001';
  const useFakeTutor =
    process.env.EXPO_PUBLIC_USE_FAKE_TUTOR === 'true' ||
    process.env.EXPO_PUBLIC_USE_FAKE_TUTOR === '1';

  return {
    apiUrl,
    useFakeTutor,
    requestTimeoutMs: 20_000,
  };
}
