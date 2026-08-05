# Module: learning-progress (frontend)

Métricas y resumen de aprendizaje derivados del historial local de tutoring.

## Layers

| Capa | Rol |
| --- | --- |
| **domain/** | Read models + service `computeProgressSummary` |
| **application/** | `getProgressSummary` + port `ListRecentSessions` (anti-corruption) |
| **infrastructure/** | Sin adapters propios — ver README en la carpeta |
| **composition/** | `createLearningProgressModule` |
| **ui/** | `ProgressScreen` |

## Responsibility

Calcular rachas, actividad por materia, meta semanal y recomendaciones a partir de `RecentTutoringSessionDto` (contexto tutoring).

## Public API

Importar desde `@/modules/learning-progress`:

- Domain: `ProgressSummary`, `computeProgressSummary`, …
- Application: `createGetProgressSummary`, `ListRecentSessions`
- Composition: `createLearningProgressModule`

`ProgressScreen`: desde `@/modules/learning-progress/ui` solo en `src/app/`.
