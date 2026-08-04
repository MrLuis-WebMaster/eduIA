# Module: tutoring (frontend)

Chat del tutor educativo en el dispositivo.

## Responsibility

Gestionar sesiones de tutoría: enviar mensajes, persistir historial local, listar sesiones recientes y renderizar la UI del tab Tutor.

## Public API

Importar solo desde `@/modules/tutoring` (`index.ts`):

- Domain: tipos/constantes de sesión, materias, acciones rápidas.
- Application ports: `TutorEngine`, `ConversationRepository` (`application/ports.ts`).
- Adapters: `FakeTutorEngine`, `HttpTutorEngine`, repositorios AsyncStorage / in-memory.
- Composition: `createTutoringModule`.
- UI: `TutorScreen`, `useTutorSession`, `useRecentTutoringSessions`.

## Wiring

Composition root: `frontend/src/bootstrap/` elige `fake` vs `remote` según `EXPO_PUBLIC_TUTOR_MODE`.

| Modo | Adapter |
| --- | --- |
| `fake` | `FakeTutorEngine` (sin red) |
| `remote` | `HttpTutorEngine` → `POST /api/v1/tutor/messages` |

Env: [docs/reference/environment.md](../../../../docs/reference/environment.md).

## Depends on

- `shared/http`, `shared/config`, design system (UI).
- Backend tutoring cuando `remote` ([backend module](../../../../backend/src/modules/tutoring/README.md)).
