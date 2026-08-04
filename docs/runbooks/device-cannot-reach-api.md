---
title: "Runbook: el dispositivo no alcanza la API"
owner: platform
last_reviewed: 2026-08-04
---

# Runbook: el dispositivo no alcanza la API

## Síntomas

- Tutor en modo `remote` falla con red / timeout / connection refused.
- `GET /api/v1/health` no responde desde el teléfono.
- En logs del backend no aparece la request.

## Chequeos rápidos

1. ¿`EXPO_PUBLIC_TUTOR_MODE=remote`? Si solo necesitas demo: cambia a `fake` ([how-to/switch-tutor-mode.md](../how-to/switch-tutor-mode.md)).
2. ¿Backend arriba? `pnpm dev:backend` y health en el PC: `http://localhost:3001/api/v1/health`.
3. ¿Misma Wi‑Fi entre PC y teléfono?
4. ¿`EXPO_PUBLIC_API_URL` usa la **IP LAN del PC**, no `localhost`?
5. ¿Firewall del PC bloquea el puerto `3001`?
6. ¿Reiniciaste Metro después de editar `.env`?

## Resolución típica

```bash
# frontend/.env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3001
EXPO_PUBLIC_TUTOR_MODE=remote
```

```bash
pnpm dev
```

Guía paso a paso: [how-to/run-on-physical-device.md](../how-to/run-on-physical-device.md).

## Emuladores

| Entorno | URL típica |
| --- | --- |
| iOS simulator / web | `http://localhost:3001` |
| Android emulator | `http://10.0.2.2:3001` |
| Dispositivo físico | `http://<IP-LAN-PC>:3001` |

## Escalación

Si health responde en LAN pero el tutor falla: revisar CORS (`CORS_ORIGIN`), rate limit y logs del backend (`LOG_LEVEL`). Contrato: [reference/api.md](../reference/api.md).
