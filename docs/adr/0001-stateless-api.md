# ADR 0001 — API sin autenticación ni base de datos; estado en el dispositivo

- Status: Accepted
- Date: 2026-03-01

## Context

EduIA es un MVP de tutoría educativa. El flujo prioritario es el chat pedagógico. Autenticación, multi-usuario y sync multi-dispositivo aumentarían superficie de ataque, tiempo de entrega y complejidad operativa sin validar primero el core del producto.

## Decision

- Backend **sin autenticación**.
- Backend **sin base de datos**: API **stateless**.
- Historial de conversaciones y preferencias viven en el dispositivo (**AsyncStorage**).

## Consequences

- Onboarding y demos rápidos; menos infra.
- No hay sync multi-dispositivo ni cuentas.
- El progreso es local al teléfono.
- Evolución futura (auth + persistencia servidor) requerirá un RFC y probablemente superseder este ADR.
