// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'node_modules/*', '.expo/*', 'android/*', 'ios/*'],
  },
  {
    // Deferred UI/Reanimated patterns — real code review in Phases 3/6/7.
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/incompatible-library': 'warn',
    },
  },
  {
    // ADR 0002 — cross-module imports only via public @/modules/<name>.
    // Same-module tests may use deep paths; exclude *.test.*.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@/modules/*/ui',
                '@/modules/*/ui/*',
                '@/modules/*/domain',
                '@/modules/*/domain/*',
                '@/modules/*/application',
                '@/modules/*/application/*',
                '@/modules/*/adapters',
                '@/modules/*/adapters/*',
                '@/modules/*/composition',
                '@/modules/*/composition/*',
              ],
              message:
                'Import the module public API (@/modules/<name>) instead of internal paths (ADR 0002).',
            },
          ],
        },
      ],
    },
  },
]);
