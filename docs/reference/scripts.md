---
title: "Referencia: scripts del monorepo"
owner: platform
last_reviewed: 2026-08-04
---

# Referencia: scripts del monorepo

Scripts raíz (`package.json`). Los paquetes se filtran con `pnpm --filter frontend|backend`.

## Desarrollo

| Script | Qué hace |
| --- | --- |
| `pnpm dev` | Frontend (Expo) + backend en paralelo |
| `pnpm dev:frontend` | Solo Metro / Expo Go |
| `pnpm dev:backend` | Solo API Express |
| `pnpm start:dev-client` | Expo development build |
| `pnpm android` / `pnpm ios` / `pnpm web` | Targets Expo |

## Calidad

| Script | Qué hace |
| --- | --- |
| `pnpm lint` | Lint en todos los workspaces |
| `pnpm typecheck` | `tsc --noEmit` en ambos paquetes |
| `pnpm test` | Vitest (frontend + backend) |
| `pnpm build` | Compila la API (backend) |
| `pnpm openapi:generate` / `openapi:check` | OpenAPI desde Zod → `docs/reference/openapi.json` |
| `pnpm docs:dev` / `docs:build` | Site VitePress de `docs/` |
| `pnpm docs:links` | Comprueba links rotos en Markdown |
| `pnpm verify` | Gate local: lint + typecheck + test + build + openapi + docs links |

## CI

Cada push/PR a `main` ejecuta lint, typecheck, test, build, openapi:check, docs:links y docs:build en paralelo ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)). Install con `--frozen-lockfile`.

Reproducir CI: [how-to/debug-ci.md](../how-to/debug-ci.md).
