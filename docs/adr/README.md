# Architecture Decision Records (ADR)

Decisiones arquitectónicas versionadas. Formato corto: contexto → decisión → consecuencias.

| ADR | Título | Estado |
| --- | --- | --- |
| [0001](./0001-stateless-api.md) | API sin auth ni base de datos; estado en dispositivo | Accepted |
| [0002](./0002-hexagonal-pragmatic.md) | Hexagonal pragmático por módulo | Accepted |
| [0003](./0003-no-streaming-responses.md) | Respuesta completa sin streaming | Accepted |
| [0004](./0004-fake-providers-always-available.md) | Proveedores fake siempre disponibles | Accepted |

## Cómo añadir uno

1. Copia el número siguiente (`0005-...md`).
2. Usa el template abajo.
3. Enlázalo en esta tabla.
4. Si reemplaza una decisión anterior, marca el ADR viejo como **Superseded** y apunta al nuevo.

```markdown
# ADR NNNN — Título

- Status: Proposed | Accepted | Superseded by ADR-XXXX
- Date: YYYY-MM-DD

## Context

## Decision

## Consequences
```

Propuestas grandes antes de decidir: [rfcs/](../rfcs/).
