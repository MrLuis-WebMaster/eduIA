# EduIA

[![CI](https://github.com/MrLuis-WebMaster/eduIA/actions/workflows/ci.yml/badge.svg)](https://github.com/MrLuis-WebMaster/eduIA/actions/workflows/ci.yml)

MVP de tutoría educativa asistida por IA: React Native / Expo + API Express en monorepo pnpm. Tutor IA, preferencias locales y métricas de progreso en el dispositivo.

## Arranque rápido

```bash
pnpm install
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
pnpm dev
```

- **Frontend:** Metro / Expo Go.
- **Backend:** `http://localhost:3001/api/v1/health`
- **Gate local:** `pnpm verify`

Guía completa: [docs/getting-started.md](docs/getting-started.md).

## Qué incluye el producto

- **Tutor IA** — chat por materia/dificultad, Markdown, cancelación, reintento, offline/error.
- **Preferencias** — perfil, materias, estilo, tema (AsyncStorage).
- **Progreso** — actividad, racha y resumen semanal desde el historial local.
- **Modos** — `fake` (sin red) o `remote` (API + OpenAI/fake). Ver [how-to/switch-tutor-mode](docs/how-to/switch-tutor-mode.md).

## Stack

| Capa | Tecnología |
| --- | --- |
| **Mobile** | Expo SDK 57, Expo Router, React Native, TypeScript, TanStack Query, Zustand |
| **Backend** | Express, TypeScript, Zod, Vitest |
| **Estilos** | NativeWind v4, tokens semánticos, CVA |
| **Monorepo** | pnpm workspaces (`frontend/`, `backend/`) |

## Documentación

Organizada con Diátaxis. Índice: **[docs/README.md](docs/README.md)**.

| Necesitas | Documento |
| --- | --- |
| Empezar | [getting-started](docs/getting-started.md) |
| Env vars | [reference/environment](docs/reference/environment.md) |
| API HTTP | [reference/api](docs/reference/api.md) |
| Scripts / CI | [reference/scripts](docs/reference/scripts.md) |
| Arquitectura | [explanation/architecture](docs/explanation/architecture.md) |
| Design system | [explanation/design-system](docs/explanation/design-system.md) |
| Decisiones (ADR) | [docs/adr/](docs/adr/) |
| Dispositivo físico | [how-to](docs/how-to/run-on-physical-device.md) · [runbooks](docs/runbooks/) |
| Ops (CI, 429, timeout, CORS) | [docs/runbooks/](docs/runbooks/) |
| Propuestas grandes | [docs/rfcs/](docs/rfcs/) |

## Limitaciones conocidas

- Sin autenticación ni multi-usuario.
- Sin sync multi-dispositivo del historial.
- Sin streaming de respuestas del tutor.
- En dispositivo físico, `localhost` no alcanza el PC: IP LAN o modo `fake`.

## Mejoras futuras

Streaming, auth/sesiones, persistencia en servidor, observabilidad, más proveedores de IA, builds firmados, extensiones de producto. Cambios grandes: [RFC](docs/rfcs/TEMPLATE.md) → [ADR](docs/adr/).
