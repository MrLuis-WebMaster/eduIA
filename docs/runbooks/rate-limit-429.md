---
title: "Runbook: rate limit 429 en el tutor"
owner: platform
last_reviewed: 2026-08-04
---

# Runbook: rate limit 429 en el tutor

## Síntomas

- `POST /api/v1/tutor/messages` responde **429**.
- Body con `error.code: "RATE_LIMIT_EXCEEDED"` y `retryable: true`.
- La app muestra error reintentable al enviar muchos mensajes seguidos.

## Contexto

El rate limit aplica **solo** a la ruta del tutor (`express-rate-limit`). Defaults:

| Variable | Default |
| --- | --- |
| `TUTOR_RATE_LIMIT_WINDOW_MS` | `60000` (1 min) |
| `TUTOR_RATE_LIMIT_MAX` | `30` |

Fuente: [reference/environment.md](../reference/environment.md).

## Chequeos

1. ¿Es abuso real o una sesión intensiva / tests automatizados?
2. Confirma headers de rate limit (`RateLimit-*` / estándar de `express-rate-limit`).
3. Revisa `backend/.env` por valores demasiado bajos en desarrollo.

## Resolución

**Desarrollo / demos:** sube el máximo o la ventana en `backend/.env` y reinicia el backend:

```bash
TUTOR_RATE_LIMIT_WINDOW_MS=60000
TUTOR_RATE_LIMIT_MAX=120
```

**Producto:** espera a que cierre la ventana; la UI debe permitir reintento (`retryable: true`). No deshabilites el límite en entornos compartidos sin decisión explícita.

**Tests:** espacia requests o usa límites altos solo en el entorno de test.
