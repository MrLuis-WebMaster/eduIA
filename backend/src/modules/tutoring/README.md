# Module: tutoring (backend)

Generación de respuestas del tutor vía HTTP.

## Layers

| Capa | Rol |
| --- | --- |
| **domain/** | Tipos/VOs, `PedagogicalPolicy`, `parseTutorAgentDecision` |
| **application/** | `GenerateTutorResponse` + port `AIProvider` |
| **infrastructure/** | inbound HTTP (router/controller/Zod), outbound OpenAI/Fake |
| **composition/** | `composeTutoring` — elige provider |

Sin entidad de sesión: API **stateless** ([ADR 0001](../../../../docs/adr/0001-stateless-api.md)). El agregado de chat vive en el dispositivo.

## Responsibility

Validar el body, aplicar política pedagógica, llamar al `AIProvider` y devolver la respuesta completa (sin streaming).

## Public API

- Domain: tipos + `buildPedagogicalSystemPrompt`, `parseTutorAgentDecision`. `assessTutorScope` solo para fake.
- Port: `AIProvider`.
- Use case: `GenerateTutorResponse`.
- Composition: `composeTutoring`, `createAIProvider`.
- Providers: `FakeAIProvider`, `OpenAIProvider`.

## HTTP

| Método | Ruta |
| --- | --- |
| `POST` | `/api/v1/tutor/messages` |

Contrato: [docs/reference/api.md](../../../../docs/reference/api.md).

## ADRs

- [0001](../../../../docs/adr/0001-stateless-api.md), [0002](../../../../docs/adr/0002-hexagonal-pragmatic.md), [0003](../../../../docs/adr/0003-no-streaming-responses.md), [0004](../../../../docs/adr/0004-fake-providers-always-available.md)
