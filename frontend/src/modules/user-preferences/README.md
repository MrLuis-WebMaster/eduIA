# Module: user-preferences (frontend)

Preferencias de perfil y de app con persistencia local.

## Responsibility

Nombre, rol, nivel, materias, estilo del tutor, tema y meta semanal. Hidratar Zustand desde AsyncStorage y exponer la UI de preferencias / “Mi espacio”.

## Public API

Importar solo desde `@/modules/user-preferences`:

- Domain: `UserPreferences`, opciones de tema/rol/estilo.
- Application ports: `PreferencesRepository`.
- Adapters: `AsyncStoragePreferencesRepository`, `InMemoryPreferencesRepository`, `STORAGE_KEYS`.
- Composition: `createUserPreferencesModule`.
- UI: `PreferencesScreen`, `PreferencesHydrator`, `usePreferences`, `usePreferencesStore`.

## Wiring

Composition root en `bootstrap/` (`DependenciesProvider`). Claves de storage viven en adapters.

## Depends on

- AsyncStorage (driven adapter).
- Design system (sheets, selects, theme).
