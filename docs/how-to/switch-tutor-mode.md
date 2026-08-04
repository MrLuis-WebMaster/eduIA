---
title: "How-to: cambiar el modo del tutor"
owner: platform
last_reviewed: 2026-08-04
---

# How-to: cambiar el modo del tutor

El tutor puede ejecutarse en el dispositivo (`fake`) o contra la API (`remote`).

## Modos

| `EXPO_PUBLIC_TUTOR_MODE` | Motor | Backend |
| --- | --- | --- |
| `fake` | `FakeTutorEngine` local | No requerido |
| `remote` | `HttpTutorEngine` → `POST /api/v1/tutor/messages` | Requerido |

Cuando usas `remote`, el backend elige el proveedor con `AI_PROVIDER` (`fake` | `openai`). Ver [reference/environment.md](../reference/environment.md).

## Recetas

### Demo sin red

```bash
# frontend/.env
EXPO_PUBLIC_TUTOR_MODE=fake
```

### Integración con API, sin OpenAI

```bash
# frontend/.env
EXPO_PUBLIC_TUTOR_MODE=remote
EXPO_PUBLIC_API_URL=http://localhost:3001

# backend/.env
AI_PROVIDER=fake
```

En emulador Android usa `http://10.0.2.2:3001`. En dispositivo físico, la IP LAN.

### OpenAI real

```bash
# frontend/.env
EXPO_PUBLIC_TUTOR_MODE=remote
EXPO_PUBLIC_API_URL=http://localhost:3001

# backend/.env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

No versiones `.env` con claves reales.

## Después de cambiar

Reinicia Metro (y el backend si cambiaste `backend/.env`) para que lean las variables.
