# AGENTS.md — EduIA monorepo

Instrucciones para humanos y agentes de código que trabajan en este repositorio.

## Fuente de verdad

- Documentación del equipo: [`docs/README.md`](docs/README.md) (Diátaxis).
- No inventar env vars ni rutas HTTP: usar [`docs/reference/`](docs/reference/).
- Decisiones de arquitectura: [`docs/adr/`](docs/adr/). No contradecir ADRs Accepted sin RFC/ADR nuevo.
- Expo (frontend): versión fijada en [`frontend/AGENTS.md`](frontend/AGENTS.md) — lee docs de Expo **v57**.

## Estructura

- Monorepo pnpm: `frontend/` (Expo) + `backend/` (Express).
- Módulos por capacidad; API pública solo vía `index.ts` del módulo.
- Composition root: `frontend/src/bootstrap/`.

## Al cambiar código

Si el PR toca API, env, arquitectura o una decisión: actualiza el doc canónico en el mismo PR (checklist en `.github/pull_request_template.md`).

## Comandos

```bash
pnpm install
pnpm dev
pnpm verify
```

Detalle: [docs/getting-started.md](docs/getting-started.md), [docs/reference/scripts.md](docs/reference/scripts.md).
