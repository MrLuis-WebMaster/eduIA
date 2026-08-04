# ADR 0004 — Proveedores fake siempre disponibles

- Status: Accepted
- Date: 2026-03-01

## Context

Reviewers y demos deben poder ejercer el producto sin red, sin API key y sin depender de cuotas de OpenAI.

## Decision

- Frontend: `EXPO_PUBLIC_TUTOR_MODE=fake` → `FakeTutorEngine`.
- Backend: `AI_PROVIDER=fake` → `FakeAIProvider` determinista.
- Ambos modos permanecen como caminos de primera clase, no solo stubs de desarrollo.

## Consequences

- Demos y CI sin secretos externos.
- Contratos HTTP y UI se pueden validar de punta a punta en modo fake.
- Hay que mantener fake alineado con el contrato real (campos, errores razonables).
