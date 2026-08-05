# Module: learning-progress (frontend)

Métricas de progreso derivadas del historial de tutoría en el dispositivo.

## Responsibility

Calcular resumen de progreso (racha, actividad semanal, materias) a partir de las sesiones recientes del módulo tutoring. No llama a la API remota.

## Public API

Importar desde `@/modules/learning-progress`:

- Domain: helpers puros (`computeProgressSummary`, `computeStreak`, …).
- Application: `createGetProgressSummary`, tipo `ListRecentSessions`.
- Composition: `createLearningProgressModule` (bootstrap puede importar `./composition` directo).

`ProgressScreen` / `useLearningProgress`: importar desde `@/modules/learning-progress/ui` solo desde `src/app/` (o relativo dentro del módulo).

## Wiring

El composition root inyecta `ListRecentSessions` desde tutoring. La UI consume `getProgressSummary` vía `useLearningProgress`. La meta semanal se lee desde preferencias.

## Depends on

- Historial de `tutoring` (sesiones locales).
- Design system para la pantalla de progreso.
