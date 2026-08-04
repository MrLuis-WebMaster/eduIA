# How-to: depurar CI en local

Reproduce el gate de GitHub Actions antes de abrir o actualizar un PR.

## Gate completo

```bash
pnpm verify
```

Equivale a: `lint` → `typecheck` → `test` → `build` (API).

## Por check

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Por paquete:

```bash
pnpm --filter frontend lint
pnpm --filter frontend typecheck
pnpm --filter frontend test
pnpm --filter backend lint
pnpm --filter backend typecheck
pnpm --filter backend test
pnpm --filter backend build
```

## Fallos frecuentes

| Síntoma | Qué mirar |
| --- | --- |
| Lockfile / install en CI | Usa `pnpm install` con el lockfile; CI usa `--frozen-lockfile` |
| Typecheck frontend | Paths `@/*` y tipos de NativeWind / Expo |
| Tests backend | Variables en tests; `createApp` sin `listen` |
| Build API | `tsc` del backend; no incluir tests en el build |

El workflow vive en [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).
