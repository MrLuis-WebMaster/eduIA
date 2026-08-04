---
title: "ADR 0005 — NativeWind + design system propio"
owner: platform
last_reviewed: 2026-08-04
---

# ADR 0005 — NativeWind + design system propio

- Status: Accepted
- Date: 2026-08-04

## Context

La UI móvil necesita velocidad de iteración (utilidades CSS) y consistencia visual a largo plazo (componentes y tokens semánticos). Usar solo NativeWind/Tailwind en pantallas genera drift. Un design system rígido sin utilidades ralentiza el MVP.

## Decision

- **NativeWind v4** para estilos utilitarios y theming (incl. dark mode vía tokens/CSS variables).
- **Design system propio** en `frontend/src/design-system/`: tokens semánticos + componentes CVA (`AppButton`, `AppScreen`, etc.).
- Las pantallas y features **consumen el DS**; NativeWind no sustituye a los componentes compartidos.
- Nuevos patrones de UI se estabilizan en el DS antes de copiar markup ad hoc entre módulos.

## Consequences

- UX consistente entre Tutor / Progreso / Preferencias.
- Coste de mantener tokens y componentes; justificado para un producto serio.
- Cambios visuales globales pasan por el DS, no por N pantallas sueltas.
- Ampliaciones grandes del DS (nueva tipografía, motion system) deben ir por RFC si impactan todo el producto.

Ver explicación: [explanation/design-system.md](../explanation/design-system.md).
