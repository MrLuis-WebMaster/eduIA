---
title: "ADR 0002 — Hexagonal + DDD por módulo"
owner: platform
last_reviewed: 2026-08-05
---

# ADR 0002 — Hexagonal + DDD por módulo

- Status: Accepted
- Date: 2026-03-01
- Updated: 2026-08-05 — carpeta `adapters/` → `infrastructure/`; DDD explícito en domain

## Context

Se necesita separación clara entre reglas de negocio e integraciones (React, Express, OpenAI, AsyncStorage), con un lenguaje de dominio coherente para tutoría, progreso y preferencias — sin el costo de event sourcing ni un hexagonal rígido vacío.

## Decision

- Módulos por capacidad (`tutoring`, `learning-progress`, `user-preferences`) como bounded contexts ligeros.
- Capas por módulo: `domain/`, `application/`, `infrastructure/`, `composition/`, y `ui/` en frontend.
- Dominio independiente de frameworks; puertos en application; implementaciones driving/driven en `infrastructure/`.
- Composition root manual (`bootstrap/`, `*/composition/`).
- API pública del módulo solo vía `index.ts`.
- **DDD pragmático:**
  - **Tutoring (FE):** agregado `TutorSessionAggregate` (snapshots para persistencia/UI), policies, domain events como records (sin bus).
  - **Tutoring (BE):** policies pedagógicas + servicio `parseTutorAgentDecision`; sin entidad de sesión (API stateless, ADR 0001).
  - **Progress:** domain service puro `computeProgressSummary`; puerto anti-corruption hacia tutoring.
  - **Preferences:** normalización/validación en dominio; repos solo persisten.
- Shared kernel de perfil tutor en `frontend/src/shared/domain/`.

## Consequences

- Testabilidad del dominio y de use cases sin UI/HTTP.
- Imports cross-módulo controlados (solo API pública).
- Más estructura en `domain/` (entities, policies, services); justificado por claridad DDD/hexagonal en entrevista y mantenimiento.
- Evolución a event bus / auth / streaming requiere RFC y probablemente nuevos ADRs.
