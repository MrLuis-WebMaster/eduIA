# Explanation: design system

Por qué existe un design system propio encima de NativeWind.

## Ubicación

`frontend/src/design-system/`

## Qué incluye

- Tokens semánticos (color, tipografía, spacing, radius, layout) y temas claro/oscuro.
- Componentes reutilizables con NativeWind + CVA (`AppButton`, `AppInput`, `AppScreen`, `AppHeader`, `AppSelect`, estados vacíos/error, toasts, sheets, etc.).

## Principio

Las pantallas consumen el Design System. NativeWind acelera estilos utilitarios; **no sustituye** el sistema de componentes.

Decisión relacionada: NativeWind + DS propio (tabla histórica en README; formalizar en ADR si el equipo amplía el DS).
