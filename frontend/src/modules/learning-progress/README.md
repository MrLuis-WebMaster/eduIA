# Module: learning-progress (frontend)

Métricas de progreso derivadas del historial de tutoría en el dispositivo.

## Responsibility

Calcular resumen de progreso (racha, actividad semanal, materias) a partir de las sesiones recientes del módulo tutoring. No llama a la API remota.

## Public API

Importar solo desde `@/modules/learning-progress`:

- Domain: helpers puros (`computeProgressSummary`, `computeStreak`, …).
- Application: `createGetProgressSummary`, tipo `ListRecentSessions`.
- Ports/adapters: `ProgressRepository`, `InMemoryProgressRepository`.
- Composition: `createLearningProgressModule`.
- UI: `ProgressScreen`, `useLearningProgress`.

## Wiring

El composition root inyecta `ListRecentSessions` desde tutoring. La meta semanal puede leerse desde preferencias en la UI.

## Depends on

- Historial de `tutoring` (sesiones locales).
- Design system para la pantalla de progreso.
