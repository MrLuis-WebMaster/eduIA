---
title: "Referencia: variables de entorno"
owner: platform
last_reviewed: 2026-08-04
---

# Referencia: variables de entorno

Fuente de verdad de configuración. Plantillas sin secretos:

- [`frontend/.env.example`](../../frontend/.env.example)
- [`backend/.env.example`](../../backend/.env.example)

No versiones archivos `.env` con claves reales.

## Frontend

| Variable | Valores | Descripción |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | URL sin slash final | Base de la API Express |
| `EXPO_PUBLIC_TUTOR_MODE` | `fake` \| `remote` | Motor local vs HTTP |

### `EXPO_PUBLIC_TUTOR_MODE`

| Valor | Comportamiento |
| --- | --- |
| `fake` | `FakeTutorEngine` local. No requiere backend ni red. |
| `remote` | `HttpTutorEngine` → `POST /api/v1/tutor/messages` |

### Ejemplos de `EXPO_PUBLIC_API_URL`

```bash
# Simulador / web
EXPO_PUBLIC_API_URL=http://localhost:3001

# Emulador Android
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001

# Dispositivo físico (misma Wi‑Fi)
EXPO_PUBLIC_API_URL=http://192.168.1.42:3001
EXPO_PUBLIC_TUTOR_MODE=remote
```

## Backend

| Variable | Default / notas | Descripción |
| --- | --- | --- |
| `PORT` | `3001` | Puerto HTTP |
| `NODE_ENV` | `development` | Entorno |
| `CORS_ORIGIN` | `*` | Origen CORS |
| `LOG_LEVEL` | `info` | Nivel de log |
| `AI_PROVIDER` | `fake` | Proveedor de IA (`fake` \| `openai`) |
| `OPENAI_API_KEY` | — | Obligatorio si `AI_PROVIDER=openai` |
| `OPENAI_MODEL` | `gpt-4o-mini` | Modelo OpenAI |
| `AI_REQUEST_TIMEOUT_MS` | `20000` | Timeout llamada IA |
| `TUTOR_RATE_LIMIT_WINDOW_MS` | `60000` | Ventana rate limit |
| `TUTOR_RATE_LIMIT_MAX` | `30` | Máx. requests por ventana |

### `AI_PROVIDER`

Aplica cuando el frontend usa `remote`:

| Valor | Comportamiento |
| --- | --- |
| `fake` | Respuestas deterministas sin API key. |
| `openai` | OpenAI real (`OPENAI_API_KEY` obligatorio). |

## Recetas combinadas

```bash
# Demo sin red (solo móvil)
EXPO_PUBLIC_TUTOR_MODE=fake

# Backend fake (sin OpenAI)
EXPO_PUBLIC_TUTOR_MODE=remote
AI_PROVIDER=fake

# OpenAI real
EXPO_PUBLIC_TUTOR_MODE=remote
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

Procedimientos: [how-to/switch-tutor-mode.md](../how-to/switch-tutor-mode.md).
