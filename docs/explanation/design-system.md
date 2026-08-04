---
title: "Explanation: design system"
owner: platform
last_reviewed: 2026-08-04
---

# Explanation: design system

Por qué existe un design system propio encima de NativeWind.

## Ubicación

`frontend/src/design-system/`

## Qué incluye

- Tokens semánticos (color, tipografía, spacing, radius, layout) y temas claro/oscuro.
- Componentes reutilizables con NativeWind + CVA (`AppButton`, `AppInput`, `AppScreen`, `AppHeader`, `AppSelect`, estados vacíos/error, toasts, sheets, etc.).

## Principio

Las pantallas consumen el Design System. NativeWind acelera estilos utilitarios; **no sustituye** el sistema de componentes.

Decisión formal: [ADR 0005](../adr/0005-nativewind-design-system.md).
