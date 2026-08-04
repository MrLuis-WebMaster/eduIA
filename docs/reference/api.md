---
title: "Referencia: API HTTP"
owner: platform
last_reviewed: 2026-08-04
---

# Referencia: API HTTP

Contrato HTTP del backend. La fuente de verdad de shapes request/response es Zod; el artefacto generado es [`openapi.json`](./openapi.json).

```bash
pnpm openapi:generate   # regenera openapi.json desde Zod
pnpm openapi:check      # falla si el JSON está desfasado
```

Base URL por defecto: `http://localhost:3001` (ver `PORT` en [environment.md](./environment.md)).

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Liveness |
| `POST` | `/api/v1/tutor/messages` | Genera respuesta del tutor |

## `POST /api/v1/tutor/messages`

Body (`tutorMessageBodySchema`):

| Campo | Notas |
| --- | --- |
| `message` | 2–2000 caracteres |
| `subject` | Materia |
| `difficulty` | `basic` \| `intermediate` \| `advanced` |
| `userRole` | `student` \| `teacher` |
| `explanationStyle` | `simple` \| `detailed` \| `socratic` (default `simple`) |
| `tutorPersonality` | `friendly` \| `formal` \| `motivating` \| `patient` \| `direct` (default `friendly`) |
| `conversation` | Historial; máximo 10 mensajes |

Respuesta 200: `reply`, `provider`, `model`, `requestId`.

### Errores normalizados

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "retryable": true,
    "requestId": "string"
  }
}
```

Códigos relevantes: `VALIDATION_ERROR`, `RATE_LIMIT_EXCEEDED` (429), `AI_PROVIDER_ERROR` (502), `AI_PROVIDER_TIMEOUT` (504).

### Timeouts y límites

- Timeout del proveedor de IA: `AI_REQUEST_TIMEOUT_MS` (default `20000`).
- Rate limit en la ruta del tutor: `TUTOR_RATE_LIMIT_WINDOW_MS` / `TUTOR_RATE_LIMIT_MAX`.
- Payload JSON máximo: `32kb`.

## Seguridad (resumen)

- `helmet`, CORS configurable (`CORS_ORIGIN`), `x-powered-by` deshabilitado.
- Validación de entrada con Zod.
- Política pedagógica en dominio para acotar tono y alcance.
- Secretos solo vía variables de entorno.

Detalle de env: [environment.md](./environment.md). Decisiones de alcance: [ADR](../adr/).
