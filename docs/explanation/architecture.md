---
title: "Explanation: arquitectura"
owner: platform
last_reviewed: 2026-08-04
---

# Explanation: arquitectura

Por qué EduIA está organizado así. Para el contrato HTTP usa [reference/api.md](../reference/api.md). Para decisiones formales, [adr/](../adr/).

## Enfoque

Módulos por capacidad (`tutoring`, `learning-progress`, `user-preferences`) con **hexagonal pragmático**:

- Dominio independiente de React, Express y SDKs de terceros.
- Puertos en **application** (`application/ports.ts`); adaptadores driving (HTTP/UI) y driven (OpenAI, Fake, AsyncStorage).
- Composition root manual en `frontend/src/bootstrap/` y en `*/composition/`. React UI obtiene deps vía `DependenciesProvider` / `useAppDependencies()`; código no-React (Zustand) usa `getDependencies()`.
- Cada módulo expone su API pública vía `index.ts` (ver `README.md` del módulo); imports cross-módulo solo por esa API (regla ESLint en frontend).
- Vocabulario compartido de perfil tutor (`Subject`, `Difficulty`, `UserRole`, …) en `frontend/src/shared/domain/`.

Tutoring lleva capas completas; Progress y Preferences son más delgados (ver [ADR 0002](../adr/0002-hexagonal-pragmatic.md)).

## SOLID y patrones (pragmático)

| Principio / patrón | Dónde se ve |
| --- | --- |
| DIP + Port/Adapter | `TutorEngine`, `AIProvider`, repositorios en `application/ports` |
| Strategy | Fake vs Http / OpenAI vía composition root |
| Composition Root | `bootstrap/dependencies.ts`, `composeTutoring` |
| Policy | `PedagogicalPolicy` (BE) |
| Repository | conversaciones y preferencias en AsyncStorage |

HTTP status de errores de aplicación se deriva en el edge (`HttpStatusByErrorCode`), no en los use cases. Fake AI usa `GenerateCompletionInput.context` (no parsea el system prompt).

## Árbol relevante

```text
EduIA/
├── frontend/
│   ├── src/app/(tabs)/          # Tutor / Progreso / Perfil
│   ├── src/design-system/       # Tokens, temas, componentes
│   ├── src/modules/             # tutoring, learning-progress, user-preferences
│   ├── src/bootstrap/           # Composition root
│   └── src/shared/              # config, http, storage, errors
└── backend/
    └── src/
        ├── modules/tutoring/    # domain → use cases → adapters
        ├── modules/health/
        └── shared/
```

## Flujo runtime

```mermaid
flowchart TB
  subgraph mobile [Frontend Expo]
    Screens[Tabs Screens]
    UC[Use Cases]
    Ports[TutorEngine / Repositories]
    HttpFake[HttpTutorEngine / FakeTutorEngine]
    Storage[AsyncStorage adapters]
    Screens --> UC --> Ports
    Ports --> HttpFake
    Ports --> Storage
  end
  subgraph api [Backend Express]
    Routes[HTTP Controllers]
    GenUC[GenerateTutorResponse]
    Policy[PedagogicalPolicy]
    AI[AIProvider]
    OpenAI[OpenAIProvider]
    FakeAI[FakeAIProvider]
    Routes --> GenUC --> Policy --> AI
    AI --> OpenAI
    AI --> FakeAI
  end
  HttpFake -->|POST /api/v1/tutor/messages| Routes
```

## Estado y persistencia

- **TanStack Query:** carga y mutaciones del tutor, sesiones recientes.
- **Zustand:** preferencias de UI/sesión en memoria, hidratadas desde AsyncStorage.
- **Persistencia local:** historial y preferencias en AsyncStorage; el backend es **stateless** ([ADR 0001](../adr/0001-stateless-api.md)).

## Limitaciones conscientes

- Sin autenticación ni multi-usuario.
- Sin sync multi-dispositivo del historial.
- Sin streaming de respuestas del tutor ([ADR 0003](../adr/0003-no-streaming-responses.md)).
- En dispositivo físico, `localhost` no alcanza el PC: IP LAN o modo `fake`.
