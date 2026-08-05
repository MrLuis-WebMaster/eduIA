# Module: tutoring (frontend)

Chat del tutor educativo en el dispositivo.

## Layers

| Capa | Rol |
| --- | --- |
| **domain/** | Agregado `TutorSessionAggregate`, messages, policies (scope/follow-up), domain events (records) |
| **application/** | Use cases + ports (`TutorEngine`, `ConversationRepository`) |
| **infrastructure/** | `HttpTutorEngine`, `FakeTutorEngine`, AsyncStorage repos |
| **composition/** | `createTutoringModule` — Fake vs HTTP |
| **ui/** | `TutorScreen`, hooks (solo desde `src/app/`) |

## Responsibility

Gestionar sesiones de tutoría: enviar mensajes, persistir historial local, listar sesiones recientes y renderizar la UI del tab Tutor.

## Public API

Importar desde `@/modules/tutoring` (`index.ts`):

- Domain: tipos/constantes de sesión, `TutorSessionAggregate`, materias, acciones rápidas.
- Application ports: `TutorEngine`, `ConversationRepository`.
- Infrastructure: `FakeTutorEngine`, `HttpTutorEngine`, repositorios AsyncStorage / in-memory.
- Composition: `createTutoringModule`.
- Shared UI API: query keys, `useRecentTutoringSessions`.

Pantallas (`TutorScreen`, `useTutorSession`): importar desde `@/modules/tutoring/ui` solo desde `src/app/`.

Los filtros del chat (materia, dificultad, rol) son de **sesión**: las preferencias del perfil solo aportan valores iniciales.

Alcance pedagógico: OpenAI decide semánticamente (JSON `action`/`reply`). El modo fake usa `assessTutorScope` / `assessLocalTutorScope` para demos deterministas.

## Wiring

| Modo | Infrastructure |
| --- | --- |
| `fake` | `FakeTutorEngine` |
| `remote` | `HttpTutorEngine` → `POST /api/v1/tutor/messages` |

Env: [docs/reference/environment.md](../../../../docs/reference/environment.md).

## Depends on

- `shared/http`, `shared/config`, `shared/domain` (shared kernel), design system.
- Backend tutoring cuando `remote`.
