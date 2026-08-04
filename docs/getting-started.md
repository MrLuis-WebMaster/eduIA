---
title: "Getting started"
owner: platform
last_reviewed: 2026-08-04
---

# Getting started

Tutorial para tener EduIA corriendo en ~15 minutos. Si ya conoces el proyecto y solo necesitas un procedimiento concreto, usa [how-to/](./how-to/).

## Requisitos

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+
- Expo Go o un emulador compatible (iOS / Android)
- Clave OpenAI solo si usas `AI_PROVIDER=openai` (opcional en el primer arranque)

## 1. Clonar e instalar

```bash
git clone <repo-url>
cd EduIA
pnpm install
```

## 2. Variables de entorno

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Por defecto el frontend usa `EXPO_PUBLIC_TUTOR_MODE=fake` (demo sin red ni API key) y el backend `AI_PROVIDER=fake`. Detalle completo en [reference/environment.md](./reference/environment.md).

## 3. Arrancar

```bash
pnpm dev
```

- **Frontend:** Metro / Expo (escanea el QR con Expo Go).
- **Backend:** `http://localhost:3001/api/v1/health`

Solo una capa:

```bash
pnpm dev:frontend
pnpm dev:backend
```

## 4. Verificar calidad local

```bash
pnpm verify
```

Ejecuta lint, typecheck, tests y build de la API (mismo gate que CI).

## Qué probar primero

1. Abrir la app en Expo Go con modo `fake` y enviar un mensaje al tutor.
2. Revisar Preferencias y Progreso (datos locales en AsyncStorage).
3. (Opcional) Cambiar a `remote` + `AI_PROVIDER=fake` según [how-to/switch-tutor-mode.md](./how-to/switch-tutor-mode.md).

## Siguiente lectura

- [Arquitectura](./explanation/architecture.md)
- [API](./reference/api.md)
- [Runbook: dispositivo físico](./runbooks/device-cannot-reach-api.md)
