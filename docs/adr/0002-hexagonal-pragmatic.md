# ADR 0002 — Hexagonal pragmático por módulo

- Status: Accepted
- Date: 2026-03-01

## Context

Se necesita separación clara entre reglas de negocio e integraciones (React, Express, OpenAI, AsyncStorage), sin el costo de un hexagonal rígido en cada feature delgada.

## Decision

- Módulos por capacidad (`tutoring`, `learning-progress`, `user-preferences`).
- Dominio independiente de frameworks; puertos en application; adaptadores driving/driven.
- Composition root manual (`bootstrap/`, `*/composition/`).
- API pública del módulo solo vía `index.ts`.
- **Pragmático:** tutoring con capas completas; progress/preferences más delgados donde aporta menos.

## Consequences

- Testabilidad del dominio y de use cases sin UI/HTTP.
- Imports cross-módulo controlados (solo API pública).
- Algo más de boilerplate en módulos “gordos”; justificado por el core (tutor).
