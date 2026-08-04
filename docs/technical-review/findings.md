# Findings (auditoría acumulativa)

Hallazgos por severidad. Se actualizan en cada fase.

## Críticos

_(Ninguno.)_

## Altos

| ID | Fase | Estado | Notas |
| --- | --- | --- | --- |
| F1-H1 | 1 | **resuelto** | ESLint flat config + `eslint`/`eslint-config-expo`. Reglas React Compiler muy estrictas bajadas a warn/off temporalmente (revisión real en Fases 3/6/7). |
| F1-H2 | 1 | **resuelto** | `dev`/`start` → Expo Go; `start:dev-client` para native; README alineado. |
| F1-H3 | 1 | **resuelto** | TypeScript pin `~5.9.3` en frontend, backend y root. |

## Medios

| ID | Fase | Estado | Notas |
| --- | --- | --- | --- |
| F1-M1 | 1 | **resuelto (pragmático)** | Backend `lint` tipa `src` + `tests` vía `tsconfig.tests.json`. No hay ESLint de estilo en API (proporcional). |
| F1-M2 | 1 | **resuelto** | `frontend/README.md` apunta al README raíz. |
| F1-M3 | 1 | **resuelto** | `.env.example` + README documentan que `gemini` no está implementado. |
| F1-M4 | 1 | **resuelto** | Default sin env → `fake`. |
| F1-M5 | 1 | **aplazado → Fase 8** | Imports profundos entre módulos. |
| F1-M6 | 1 | **resuelto** | Eliminado `android:native`. |
| F1-M7 | 1 | **resuelto** | `backend/tsconfig.tests.json` incluido en typecheck/lint. |

## Bajos

| ID | Fase | Estado | Notas |
| --- | --- | --- | --- |
| F1-L1 | 1 | **resuelto** | Eliminados leftovers del template (`components/`, hooks scaffold, `constants/theme`). |
| F1-L2 | 1 | **resuelto** | Eliminado `adb-death.log` (~267 MB). Ya cubierto por `*.log` en `.gitignore`. |
| F1-L3 | 1 | **resuelto** | Eliminado `prettier-plugin-tailwindcss` huérfano. |
| F1-L4 | 1 | **resuelto** | Eliminado `scripts/reset-project.js`. |

## Nuevos / abiertos (post-Fase 1)

| ID | Severidad | Problema | Estado |
| --- | --- | --- | --- |
| F1-N1 | medio | ESLint marca patrones Reanimated / setState-in-effect / refs en render; reglas relajadas temporalmente | abierto → Fases 3/6/7 |
| F1-N2 | bajo | Con `node-linker=hoisted`, un `backend/node_modules/.bin` corrupto puede romper `tsc`; se reparó borrando `backend/node_modules` | monitorear |
| F1-M5 | medio | Acoplamiento entre módulos vía imports internos | Fase 8 |

## Lo que ya está bien (Fase 1)

- Monorepo pnpm claro; composition root manual.
- Backend `app.ts` / `server.ts` separados.
- Env tipado con Zod; fake/remote explícitos.
- NativeWind v4 cableado.
- Gates verificados tras correcciones: `pnpm typecheck`, `pnpm lint`, `pnpm test` OK.
