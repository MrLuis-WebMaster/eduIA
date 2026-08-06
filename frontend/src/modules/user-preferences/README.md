# Module: user-preferences (frontend)

Preferencias de perfil y de app con persistencia local.

## Layers

| Capa | Rol |
| --- | --- |
| **domain/** | Types/VOs, defaults, `normalizeUserPreferences` |
| **application/** | load/save/reset use cases + `PreferencesRepository` port |
| **infrastructure/** | AsyncStorage / in-memory repos |
| **composition/** | `createUserPreferencesModule` |
| **ui/** | `PreferencesScreen`, store, hydrator, `options/` (selects de UI con iconos) |

## Responsibility

Nombre, rol, nivel, materias, estilo del tutor, tema y meta semanal. Hidratar Zustand desde AsyncStorage.

## Public API

Importar desde `@/modules/user-preferences`:

- Domain: `UserPreferences`, opciones, normalización.
- Application ports: `PreferencesRepository`.
- Infrastructure: `AsyncStoragePreferencesRepository`, `InMemoryPreferencesRepository`, `STORAGE_KEYS`.
- Composition: `createUserPreferencesModule`.
- Shared UI API: `usePreferencesHydration`, `usePreferences`, `usePreferencesStore`.

`PreferencesScreen`: desde `@/modules/user-preferences/ui` solo en `src/app/`.

## Wiring

Composition root en `bootstrap/` (`DependenciesProvider`). Claves de storage viven en infrastructure; la validación/normalización vive en domain.
