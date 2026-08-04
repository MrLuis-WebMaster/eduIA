---
title: "Documentación EduIA"
owner: platform
last_reviewed: 2026-08-04
---

# Documentación EduIA

Documentación del monorepo organizada con [Diátaxis](https://diataxis.fr/): cada tipo de documento responde una pregunta distinta. No mezclar tutorial, how-to, referencia y explicación en el mismo archivo.

| Tipo | Pregunta | Ubicación |
| --- | --- | --- |
| **Tutorial** | ¿Cómo empiezo? | [getting-started.md](./getting-started.md) |
| **How-to** | ¿Cómo hago X? | [how-to/](./how-to/) |
| **Reference** | ¿Qué existe exactamente? | [reference/](./reference/) |
| **Explanation** | ¿Por qué está así? | [explanation/](./explanation/) |
| **Decisiones** | ¿Qué acordamos? | [adr/](./adr/) |
| **Ops** | ¿Si falla X, qué hago? | [runbooks/](./runbooks/) |
| **Propuestas** | ¿Cómo diseñamos un cambio grande? | [rfcs/](./rfcs/) |

## Mapa rápido

| Necesitas… | Ve a… |
| --- | --- |
| Correr el proyecto en 15 minutos | [getting-started.md](./getting-started.md) |
| Contrato HTTP de la API | [reference/api.md](./reference/api.md) · [openapi.json](./reference/openapi.json) |
| Variables de entorno | [reference/environment.md](./reference/environment.md) |
| Scripts del monorepo | [reference/scripts.md](./reference/scripts.md) |
| Arquitectura y capas | [explanation/architecture.md](./explanation/architecture.md) |
| Design system | [explanation/design-system.md](./explanation/design-system.md) |
| Decisiones técnicas | [adr/](./adr/) |
| Dispositivo físico no alcanza la API | [runbooks/device-cannot-reach-api.md](./runbooks/device-cannot-reach-api.md) |
| CI / 429 / timeout IA / CORS | [runbooks/](./runbooks/) |

## Convenciones

- **Una fuente de verdad:** env vars solo en `reference/environment.md`; API solo en `reference/api.md`. El README raíz enlaza, no duplica tablas.
- **Docs en el PR:** si cambias contrato, env, arquitectura o una decisión, actualiza el doc canónico en el mismo PR.
- **ADRs:** se superseden, no se borran.
- **Owners:** quien toca el área actualiza su documentación (`owner` + `last_reviewed` en el front-matter).
- **Site:** `pnpm docs:dev` / `pnpm docs:build` (VitePress).
- **Contrato vivo:** `pnpm openapi:generate` regenera `reference/openapi.json` desde Zod.

## Audiencias

| Quién | Entrada |
| --- | --- |
| Nuevo contributor / reviewer | [getting-started](./getting-started.md) → README raíz |
| Feature owner | módulo + [ADR](./adr/) + [RFC](./rfcs/) si aplica |
| Ops / debug | [runbooks/](./runbooks/) + [how-to/](./how-to/) |
| Producto | README raíz (qué hace) + limitaciones |
| Agentes AI | `AGENTS.md` / `frontend/AGENTS.md` + [architecture](./explanation/architecture.md) |
