---
title: "Runbook: CI rojo"
owner: platform
last_reviewed: 2026-08-04
---

# Runbook: CI rojo

## Síntomas

- Check Lint / Typecheck / Test / Build API / OpenAPI / Docs falla en GitHub Actions.
- `pnpm verify` falla en local.

## Chequeos rápidos

1. Reproduce en local con el mismo comando del job:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter backend build
pnpm openapi:check
pnpm docs:links
pnpm docs:build
# o el gate completo:
pnpm verify
```

2. ¿El PR tocó `pnpm-lock.yaml`? CI usa `pnpm install --frozen-lockfile`.
3. ¿Node local ≠ 20+? CI usa Node 20.
4. Mira el job concreto en la matrix (`fail-fast: false` — varios pueden fallar a la vez).

## Fallos frecuentes

| Job | Causas típicas | Acción |
| --- | --- | --- |
| Install | Lockfile desincronizado | `pnpm install` y commit del lockfile |
| Lint | Reglas ESLint / TS estricto backend | Corrige el archivo indicado en el log |
| Typecheck | Paths `@/*`, tipos Expo/NativeWind | Alinea imports y `tsconfig` |
| Test | Env/mocks; backend debe usar `createApp` sin `listen` | Reproduce con `pnpm --filter … test` |
| Build API | `tsc` incluye tests o errores de tipos | `pnpm --filter backend build` |
| OpenAPI | `openapi.json` desfasado vs Zod | `pnpm openapi:generate` |
| Docs links / site | Links rotos o VitePress | `pnpm docs:links` / `pnpm docs:build` |

## Resolución

Arregla en local → `pnpm verify` verde → push. How-to detallado: [how-to/debug-ci.md](../how-to/debug-ci.md).

Workflow: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
