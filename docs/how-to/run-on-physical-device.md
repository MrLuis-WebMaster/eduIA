---
title: "How-to: correr en dispositivo físico"
owner: platform
last_reviewed: 2026-08-04
---

# How-to: correr en dispositivo físico

Procedimiento para que la app en un teléfono real hable con la API Express del PC.

## Contexto

`localhost` en el teléfono apunta al propio dispositivo, no a tu máquina. Hay que usar la IP LAN del PC o el modo `fake`.

## Pasos

1. PC y teléfono en la **misma Wi‑Fi**.
2. Obtén la IP LAN del PC (ej. `192.168.1.42`).
3. En `frontend/.env`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.42:3001
EXPO_PUBLIC_TUTOR_MODE=remote
```

4. En `backend/.env`, deja un proveedor válido (`fake` u `openai`).
5. Reinicia Metro y el backend:

```bash
pnpm dev
```

6. Escanea el QR con Expo Go y prueba el tutor.
7. Comprueba health desde el teléfono (navegador o curl en otra máquina de la red):

```text
http://192.168.1.42:3001/api/v1/health
```

## Si no conecta

Sigue [runbooks/device-cannot-reach-api.md](../runbooks/device-cannot-reach-api.md).

## Alternativa sin red

```bash
EXPO_PUBLIC_TUTOR_MODE=fake
```

No hace falta backend ni IP LAN. Ver [switch-tutor-mode.md](./switch-tutor-mode.md).
