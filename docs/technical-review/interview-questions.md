# Preguntas de entrevista (acumulativo)

Respuestas ancladas al código real. Ampliar por fase.

## Fase 1 — Mapa del sistema

### ¿Por qué un monorepo y no dos repos?

**Respuesta sugerida:** Un solo deliverable para la prueba: misma versión de contratos HTTP, un `pnpm install`, scripts `dev`/`test` unificados. Frontend y backend siguen siendo packages independientes (`pnpm --filter`), sin compartir código de dominio a la fuerza.

### ¿Dónde está el composition root y por qué?

**Respuesta sugerida:** En `frontend/src/bootstrap/dependencies.ts` se crean storage, tutoring (fake/http), learning-progress (inyectando `listRecentSessions`) y user-preferences. En backend, `composeTutoring(env)` en el módulo tutoring, invocado desde `createApp`. Así las pantallas/controladores no eligen adapters.

### ¿Cómo eliges fake vs remote / openai?

**Respuesta sugerida:** Frontend: `EXPO_PUBLIC_TUTOR_MODE` → `getAppConfig().useFakeTutor` → `createTutoringModule({ useFake })` instancia `FakeTutorEngine` o `HttpTutorEngine`. Backend: `AI_PROVIDER` validado por Zod; openai exige `OPENAI_API_KEY` al boot. Gemini está como stub explícito que falla — no es un fallback silencioso.

### ¿Por qué `app.ts` y `server.ts` separados?

**Respuesta sugerida:** `createApp` construye Express (middlewares + rutas) sin `listen`, lo que permite tests con `supertest`. `server.ts` carga dotenv, crea la app y abre el puerto.

### ¿Qué harías distinto en producción?

**Respuesta sugerida:** ESLint real, pin de TypeScript alineado a Expo, documentar Expo Go vs dev-client, secrets vía vault, y no exponer `AI_PROVIDER=gemini` hasta implementarlo.

### Si el README dice Expo Go pero el script usa `--dev-client`, ¿qué pasa?

**Respuesta sugerida:** Metro arranca en modo development build; Expo Go no carga ese binario. Hay que usar `start:go` o un emulador con `expo run:android` (existe carpeta `android/`). Es una inconsistencia documentación/scripts a corregir.
