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
| `pnpm verify` | Gate local: lint + typecheck + test + build |

## CI

Cada push/PR a `main` ejecuta lint, typecheck, test y build en paralelo ([`.github/workflows/ci.yml`](../../.github/workflows/ci.yml)). Install con `--frozen-lockfile`.

Reproducir CI: [how-to/debug-ci.md](../how-to/debug-ci.md).
