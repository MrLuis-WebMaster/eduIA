# Module: user-preferences (frontend)

Preferencias de perfil y de app con persistencia local.

## Responsibility

Nombre, rol, nivel, materias, estilo del tutor, tema y meta semanal. Hidratar Zustand desde AsyncStorage y exponer la UI de preferencias / “Mi espacio”.

## Public API

Importar solo desde `@/modules/user-preferences`:

- Domain: `UserPreferences`, opciones de tema/rol/estilo, `STORAGE_KEYS`.
- Ports: `PreferencesRepository`.
- Adapters: `AsyncStoragePreferencesRepository`, `InMemoryPreferencesRepository`.
- Composition: `createUserPreferencesModule`.
- UI: `PreferencesScreen`, `PreferencesHydrator`, `usePreferences`, `usePreferencesStore`.

## Wiring

Composition root en `bootstrap/`. Sin variables de entorno; claves de storage en dominio.

## Depends on

- AsyncStorage (driven adapter).
- Design system (sheets, selects, theme).
