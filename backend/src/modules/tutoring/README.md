# Module: tutoring (backend)

Generación de respuestas del tutor vía HTTP.

## Responsibility

API stateless: validar el body, aplicar política pedagógica, llamar al `AIProvider` y devolver la respuesta completa (sin streaming).

## Public API

Importar desde el barrel del módulo (`index.ts`):

- Domain: tipos + `buildPedagogicalSystemPrompt`, decisión JSON del agente (`parseTutorAgentDecision`). `assessTutorScope` solo para el provider fake.
- Port: `AIProvider`.
- Use case: `GenerateTutorResponse`.
- Composition: `composeTutoring`, `createAIProvider`.
- Providers: `FakeAIProvider`, `OpenAIProvider`.

## HTTP

| Método | Ruta |
| --- | --- |
| `POST` | `/api/v1/tutor/messages` |

Contrato: [docs/reference/api.md](../../../../docs/reference/api.md).

Rate limit y timeout: `TUTOR_RATE_LIMIT_*`, `AI_REQUEST_TIMEOUT_MS` — ver [environment](../../../../docs/reference/environment.md).

## Runbooks

- [rate-limit-429](../../../../docs/runbooks/rate-limit-429.md)
- [ai-provider-timeout](../../../../docs/runbooks/ai-provider-timeout.md)

## ADRs

- [0001](../../../../docs/adr/0001-stateless-api.md), [0003](../../../../docs/adr/0003-no-streaming-responses.md), [0004](../../../../docs/adr/0004-fake-providers-always-available.md)
