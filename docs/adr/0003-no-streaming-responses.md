---
title: "ADR 0003 — Respuesta completa del tutor (sin streaming)"
owner: platform
last_reviewed: 2026-08-04
---

# ADR 0003 — Respuesta completa del tutor (sin streaming)

- Status: Accepted
- Date: 2026-03-01

## Context

El streaming mejora UX percibida, pero complica cancelación, validación de errores, pruebas y el contrato HTTP del MVP.

## Decision

La API y los engines devuelven la **respuesta completa** del tutor (no SSE/streaming token a token).

## Consequences

- Validación, reintento y cancelación más simples.
- Tests más deterministas.
- UX de “esperar y recibir” en lugar de escritura progresiva.
- Streaming queda como mejora futura (RFC + superseder este ADR).
