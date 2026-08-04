# 00 — System map (Fase 1)

> **Histórico (auditoría).** La documentación operativa del equipo vive en [`docs/README.md`](../README.md). Este archivo es un snapshot de la auditoría inicial; no usarlo como onboarding.

## Qué proyectos existen

Monorepo **pnpm workspaces** (`pnpm-workspace.yaml`):

| Package | Ruta | Rol |
| --- | --- | --- |
| `muyu-eduia` (root) | `/` | Orquestación de scripts; solo `concurrently` |
| `frontend` | `frontend/` | App Expo SDK 57 + Expo Router + NativeWind |
| `backend` | `backend/` | API Express 5 + Vitest |

Package manager fijado: `pnpm@10.30.3` (`packageManager` en root).  
Node requerido: `>=20` (entorno verificado: Node v22.14.0).

## Árbol relevante

```text
EduIA/
├── package.json                 # scripts monorepo
├── pnpm-workspace.yaml          # frontend + backend
├── pnpm-lock.yaml
├── .npmrc                       # node-linker=hoisted
├── .gitignore
├── README.md                    # documentación de producto
├── docs/technical-review/       # auditoría (este árbol)
├── frontend/
│   ├── app.json                 # Expo config
│   ├── babel.config.js          # babel-preset-expo + nativewind
│   ├── metro.config.js          # withNativeWind → src/global.css
│   ├── tailwind.config.js       # tokens + darkMode: class
│   ├── tsconfig.json            # paths @/* → ./src/*
│   ├── vitest.config.mts
│   ├── vitest.setup.ts          # mock AsyncStorage
│   ├── .env.example
│   ├── package.json
│   ├── android/                 # proyecto nativo (dev client)
│   ├── assets/
│   └── src/
│       ├── app/                 # Expo Router (driving adapters de navegación)
│       │   ├── _layout.tsx
│       │   └── (tabs)/          # Tutor / Progreso / Mi espacio
│       ├── bootstrap/           # composition root + providers
│       ├── design-system/
│       ├── modules/
│       │   ├── tutoring/
│       │   ├── learning-progress/
│       │   └── user-preferences/
│       ├── shared/              # config, http, storage, errors
│       ├── components/          # leftovers del template Expo (auditar)
│       ├── constants/
│       ├── hooks/
│       └── global.css
└── backend/
    ├── package.json
    ├── tsconfig.json            # include: src only
    ├── vitest.config.ts         # tests/**/*.test.ts
    ├── .env.example
    ├── src/
    │   ├── app.ts               # createApp (testeable sin listen)
    │   ├── server.ts            # listen + dotenv
    │   ├── modules/
    │   │   ├── health/
    │   │   └── tutoring/        # hexagonal: domain → application → adapters
    │   └── shared/              # env, errors, logging, middleware
    └── tests/
        └── tutor.api.test.ts
```

## Cómo se relacionan

```text
[Expo app]
  bootstrap/dependencies
    → TutoringModule (FakeTutorEngine | HttpTutorEngine)
    → LearningProgressModule (inyecta listRecentSessions de tutoring)
    → UserPreferencesModule (AsyncStorage)
  HttpTutorEngine ──POST /api/v1/tutor/messages──► [Express API]
                                                      → GenerateTutorResponse
                                                      → PedagogicalPolicy
                                                      → AIProvider (fake | openai | gemini stub)
```

- El **historial y preferencias viven en el dispositivo** (AsyncStorage).
- El **backend es stateless**: solo genera respuestas de tutor.
- `learning-progress` **deriva métricas** de sesiones recientes expuestas por tutoring (vía composition en bootstrap; la UI también importa hooks internos — pendiente Fase 8).

## Cómo se ejecutan

| Comando root | Efecto |
| --- | --- |
| `pnpm install` | Instala workspaces |
| `pnpm dev` | `concurrently` frontend + backend |
| `pnpm dev:frontend` | `expo start --dev-client` |
| `pnpm dev:backend` | `tsx watch src/server.ts` |
| `pnpm start` / `start:tunnel` | Expo con `--dev-client` (+ tunnel) |
| `pnpm android` / `ios` / `web` | Delegados al frontend |
| `pnpm lint` / `typecheck` / `test` | `pnpm -r run …` en ambos packages |

Frontend adicional:

| Script | Comando |
| --- | --- |
| `start:go` | `expo start` (sin `--dev-client`, apto Expo Go) |
| `android` / `android:native` | `expo run:android` (**duplicados**) |
| `test` / `test:watch` | Vitest |

Backend:

| Script | Comando |
| --- | --- |
| `dev` | `tsx watch src/server.ts` |
| `build` / `start` | `tsc` → `node dist/server.js` |
| `lint` | `tsc --noEmit` (**igual que typecheck**) |
| `typecheck` | `tsc --noEmit` |
| `test` | Vitest (`tests/**/*.test.ts`) |

## Cómo se compilan

- **Frontend:** Metro bundler (Expo). NativeWind via `withNativeWind` + Babel (`jsxImportSource: 'nativewind'`). No hay script `build` de producción en package.json.
- **Backend:** `tsc -p tsconfig.json` → `dist/`. ESM (`"type": "module"`, `module: NodeNext`).

## Cómo se prueban

| Suite | Runner | Ubicación | Cantidad observada |
| --- | --- | --- | --- |
| Frontend | Vitest (env node) | `src/**/*.test.ts` | 3 archivos |
| Backend | Vitest (env node) | `tests/**/*.test.ts` | 1 archivo |

Frontend setup: mock global de AsyncStorage en `vitest.setup.ts`.  
Alias `@` resuelto en Vitest.  
Backend: `supertest` + `createApp` (sin abrir puerto real en tests).

## Configuración de entorno

### Frontend (`frontend/.env.example`)

- `EXPO_PUBLIC_API_URL` — base API sin slash final.
- `EXPO_PUBLIC_TUTOR_MODE` — `fake` | `remote` (default en example: `fake`).
- Aliases legacy leídos en código: `EXPO_PUBLIC_TUTOR_ENGINE`, `EXPO_PUBLIC_USE_FAKE_TUTOR`.
- Si no hay mode válido → **fallback a `remote`** (`getAppConfig`).

### Backend (`backend/.env.example`)

- `PORT`, `NODE_ENV`, `CORS_ORIGIN`, `LOG_LEVEL`
- `AI_PROVIDER`: `fake` | `openai` | `gemini` (stub que falla en runtime)
- `OPENAI_API_KEY`, `OPENAI_MODEL`, `AI_REQUEST_TIMEOUT_MS`
- Rate limit: `TUTOR_RATE_LIMIT_WINDOW_MS`, `TUTOR_RATE_LIMIT_MAX`

Validación: Zod en `backend/src/shared/config/env.ts` (falla al boot si openai sin key).

## TypeScript, aliases, lint

| Área | Estado |
| --- | --- |
| Frontend TS | `strict: true`, extends `expo/tsconfig.base`, paths `@/*` → `./src/*` |
| Backend TS | `strict: true`, `src` only (tests fuera de `tsc`) |
| Versiones TS | Root hoist: **6.0.3** (frontend declara `~6.0.3`); backend declara `~5.9.3` |
| ESLint | **No hay config ni dependencia `eslint` instalada** |
| Prettier | Solo `prettier-plugin-tailwindcss` en frontend; sin config Prettier visible |
| Expo lint | Script `expo lint` — esperable que falle o pida scaffold |

## Dependencias principales

### Frontend (runtime)

Expo ~57, RN 0.86, React 19.2, Expo Router, TanStack Query, Zustand, AsyncStorage, NetInfo, FlashList, NativeWind 4, CVA, RHF + Zod, Lucide, Reanimated, Gesture Handler, Safe Area, Markdown (`react-native-marked`).

### Backend (runtime)

Express 5, Zod, OpenAI SDK, Helmet, CORS, express-rate-limit, dotenv, Pino / pino-http.

### Root

`concurrently` únicamente.

## Expo / Metro / Babel / NativeWind

- Entry: `expo-router/entry`; rutas en `src/app/` (convención Expo con carpeta `src`).
- `app.json`: scheme `eduia`, splash, typedRoutes, `reactCompiler: false`.
- Metro: `withNativeWind(config, { input: './src/global.css' })`.
- Tailwind: `darkMode: 'class'`, palette teal/navy + semánticos.
- Plugins: `expo-router`, `expo-splash-screen`.

## Observaciones de arranque vs README

1. **Resuelto:** `dev`/`start` usan Expo Go (`expo start`). Development builds: `pnpm start:dev-client` o `pnpm android`.
2. README menciona Design System / cancelación / retry / etc. — verificación de fidelidad en Fase 14.
3. **Resuelto:** `frontend/README.md` apunta al README raíz.

## Tooling (post-corrección Fase 1)

| Área | Estado |
| --- | --- |
| TypeScript | `~5.9.3` en frontend, backend y root |
| ESLint frontend | `eslint.config.js` + `eslint-config-expo` (flat) |
| Lint backend | typecheck de `src` + `tests` |
| `.npmrc` | `node-linker=hoisted` (ver glosario / explicación en chat) |

## Orden propuesto de auditoría (siguientes fases)

1. ~~Mapa del sistema~~ (esta fase)
2. Navegación y bootstrap RN
3. Design System
4. Arquitectura frontend por módulos
5. Flujo completo del tutor
6. Conceptos RN en el código
7. Estado (Query / Zustand / AsyncStorage / RHF)
8. Límites entre módulos
9–10. Backend Express + hexagonal tutoring
11. Seguridad y resiliencia
12. Modelo de progreso
13. Testing + ejecución de suites
14. README vs implementación
