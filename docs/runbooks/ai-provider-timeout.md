---
title: "Runbook: timeout del proveedor de IA"
owner: platform
last_reviewed: 2026-08-04
---

# Runbook: timeout del proveedor de IA

## Síntomas

- `POST /api/v1/tutor/messages` responde **504**.
- `error.code: "AI_PROVIDER_TIMEOUT"`, `retryable: true`.
- En el cliente: error mapeado a timeout / reintento (modo `remote`).
- Logs del backend: abort / timeout hacia OpenAI.

## Contexto

- Timeout servidor: `AI_REQUEST_TIMEOUT_MS` (default `20000`).
- Cliente HTTP del frontend también usa ~20s (`requestTimeoutMs`).
- Solo aplica con `EXPO_PUBLIC_TUTOR_MODE=remote` y `AI_PROVIDER=openai` (o un provider real lento).

Errores relacionados:

| Código | HTTP | Notas |
| --- | --- | --- |
| `AI_PROVIDER_TIMEOUT` | 504 | Abort por tiempo |
| `AI_PROVIDER_ERROR` | 502 | Fallo del provider; retryable si 429 o ≥500 del upstream |

## Chequeos

1. ¿`AI_PROVIDER=openai` y la red/API key son válidas?
2. ¿`OPENAI_API_KEY` presente y sin espacios?
3. ¿El modelo (`OPENAI_MODEL`) está disponible?
4. ¿Timeout demasiado agresivo para la latencia actual?
5. Prueba `AI_PROVIDER=fake` para aislar: si fake responde, el problema es el provider externo.

## Resolución

**Mitigación inmediata:** reintentar (es `retryable`). En demos, usa `fake`.

**Ajuste de timeout** (reinicia backend):

```bash
AI_REQUEST_TIMEOUT_MS=30000
```

**Si persiste:** revisar estado de OpenAI, cuotas, y logs del adapter (`OpenAIProvider`). No subas el timeout de forma ilimitada — enmascara fallos reales.

Contrato: [reference/api.md](../reference/api.md). Env: [reference/environment.md](../reference/environment.md).
