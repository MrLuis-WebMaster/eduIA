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
| `pnpm typecheck` | `tsc --noEmit` en ambos paquetes (TypeScript **7** nativo vía `tsc`) |
| `pnpm test` | Vitest (frontend + backend) |
| `pnpm build` | Compila la API (backend) |
| `pnpm openapi:generate` / `openapi:check` | OpenAPI desde Zod → `docs/reference/openapi.json` |
| `pnpm docs:dev` / `docs:build` | Site VitePress de `docs/` |
| `pnpm docs:links` | Comprueba links rotos en Markdown |
| `pnpm verify` | Gate local: lint + typecheck + test + build + openapi + docs links |

## TypeScript

El monorepo usa TypeScript **7** para `tsc` (typecheck/build) y TypeScript **6** como API JS para herramientas (`typescript-eslint` / Expo lint) que aún no soportan la API de TS 7:

- `@typescript/native` → `npm:typescript@~7.0.2` (binario `tsc`)
- `typescript` → `npm:@typescript/typescript6@~6.0.2` (API + `tsc6`)

Comprobar: `pnpm exec tsc --version` (7.x) y `pnpm exec tsc6 --version` (6.x).

## CI

Cada push/PR a `main` ejecuta lint, typecheck, test, build, openapi:check, docs:links y docs:build en paralelo ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)). Install con `--frozen-lockfile`.

Reproducir CI: [how-to/debug-ci.md](../how-to/debug-ci.md).
