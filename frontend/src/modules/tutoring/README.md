# Module: tutoring (frontend)

Chat del tutor educativo en el dispositivo.

## Responsibility

Gestionar sesiones de tutoría: enviar mensajes, persistir historial local, listar sesiones recientes y renderizar la UI del tab Tutor.

## Public API

Importar desde `@/modules/tutoring` (`index.ts`) para dominio/aplicación/adapters/hooks compartidos:

- Domain: tipos/constantes de sesión, materias, acciones rápidas.
- Application ports: `TutorEngine`, `ConversationRepository` (`application/ports.ts`).
- Adapters: `FakeTutorEngine`, `HttpTutorEngine`, repositorios AsyncStorage / in-memory.
- Composition: `createTutoringModule` (el composition root puede importar `./composition` directo).
- Shared UI API: query keys, `useRecentTutoringSessions`.

Pantallas (`TutorScreen`, `useTutorSession`): importar desde `@/modules/tutoring/ui` solo desde `src/app/` (evita require cycles).

Los filtros del chat (materia, dificultad, rol) son de **sesión**: las preferencias del perfil solo aportan valores iniciales; no se sincronizan en ambos sentidos.

Alcance pedagógico: OpenAI decide semánticamente (JSON `action`/`reply` con schema estricto). El modo fake usa `assessTutorScope` / `assessLocalTutorScope` solo para demos deterministas.

Markdown del tutor: además de listas y LaTeX (`$…$` / `$$…$$`), los fences ` ```mermaid ` se renderizan como diagrama (SVG). Si el render falla, se muestra el código fuente.

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
