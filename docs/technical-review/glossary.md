# Glosario (con ejemplos del proyecto)

Definiciones para la entrevista. Cada entrada: **qué es** → **para qué** → **ejemplo en EduIA**.

---

## Módulo

**Qué es:** Una capacidad de producto empaquetada (p.ej. “tutoring”), no una carpeta de utilidades.

**Para qué:** Delimitar qué puede usar el resto del sistema. Solo se importa lo exportado en `index.ts` (API pública). El interior (domain, adapters, etc.) es detalle privado.

**Ejemplo:** `frontend/src/modules/tutoring`, `learning-progress`, `user-preferences`; backend `modules/tutoring`, `modules/health`.  
Import correcto: `@/modules/tutoring`. Incorrecto: `@/modules/tutoring/domain/...` desde fuera.

---

## Dominio

**Qué es:** Las reglas y tipos del negocio, sin React, Express ni OpenAI.

**Para qué:** Que la lógica educativa/pedagógica no dependa de la UI ni de la red. Se puede testear y razonar sin frameworks.

**Ejemplo:** `tutoring/domain/*`, `pedagogical-policy.ts` en backend.  
_Comprobar en Fase 4/10 que no importen React/Express/OpenAI._

---

## Entidad

**Qué es:** Un objeto con **identidad** (id) y ciclo de vida: nace, cambia, se guarda.

**Para qué:** Distinguir “esta sesión concreta” de un valor intercambiable.

**Ejemplo:** `TutorSession` (tiene id e historial de mensajes). Si solo es un bag de datos sin comportamiento, sigue siendo el candidato a entidad del módulo.

---

## Value object

**Qué es:** Un valor definido por sus atributos, **sin id propio**. Dos “Matemáticas” iguales son lo mismo.

**Para qué:** Modelar conceptos estables (materia, dificultad, rol) sin tratarlos como filas con identidad.

**Ejemplo:** `Subject`, `Difficulty`, `UserRole`. En este repo suelen ser unions/enums; no hace falta clase si el tipo ya basta.

---

## Invariante

**Qué es:** Una regla que **siempre** debe cumplirse.

**Para qué:** Evitar estados inválidos (mensaje vacío, rol inventado) en el borde o en dominio.

**Ejemplo:** `MESSAGE_MAX_LENGTH` / `MESSAGE_MIN_LENGTH` en domain tutoring; schema Zod del body del tutor en backend.

---

## Caso de uso

**Qué es:** Un flujo concreto de la aplicación: recibe entrada, usa puertos, devuelve resultado.

**Para qué:** Un lugar claro por intención de negocio (“enviar mensaje al tutor”, “obtener resumen de progreso”), no mezclado en la UI ni en el controlador HTTP.

**Ejemplo:** `createSendTutorMessage`, `GenerateTutorResponse`, `createGetProgressSummary`.

---

## DTO

**Qué es:** Un “paquete de datos” para cruzar capas o módulos. Sin lógica.

**Para qué:** No filtrar entidades internas a quien no las necesita; solo el shape acordado.

**Ejemplo:** `RecentTutoringSessionDto` — tutoring lo produce; learning-progress lo consume para el resumen.

---

## Puerto

**Qué es:** Una interfaz (“necesito algo que…”) que define el application layer. No dice *cómo* se implementa.

**Para qué:** Dependency inversion: el caso de uso no conoce AsyncStorage ni OpenAI; solo el contrato.

**Ejemplo:** `TutorEngine`, `ConversationRepository`, `AIProvider`, `PreferencesRepository`.

---

## Driving adapter (inbound)

**Qué es:** Lo que **entra** desde fuera y dispara un caso de uso (pantalla, ruta HTTP).

**Para qué:** Traducir el mundo exterior (tap, POST) a la aplicación.

**Ejemplo:** pantallas Expo Router `app/(tabs)/*.tsx`; `tutor.controller.ts` / router en backend.

---

## Driven adapter (outbound)

**Qué es:** Lo que **sale** hacia infraestructura: implementa un puerto.

**Para qué:** Cambiar fake ↔ HTTP ↔ OpenAI sin tocar el caso de uso.

**Ejemplo:** `HttpTutorEngine`, `FakeTutorEngine`, `AsyncStorageConversationRepository`, `OpenAIProvider`, `FakeAIProvider`.

```text
[UI / HTTP]  ──driving──►  [caso de uso]  ──puerto──►  [driven: DB / IA / API]
```

---

## Repositorio

**Qué es:** Puerto (y su adapter) para **persistir** y recuperar datos del módulo.

**Para qué:** Aislar “dónde se guarda” (AsyncStorage, memoria, etc.).

**Ejemplo:** `ConversationRepository` → `AsyncStorageConversationRepository`; `PreferencesRepository`.

---

## Provider

**Qué es:** Puerto hacia un **servicio externo** (aquí, IA). Similar a repositorio, pero no es “nuestra” persistencia.

**Para qué:** Intercambiar OpenAI / fake / stubs sin cambiar `GenerateTutorResponse`.

**Ejemplo:** `AIProvider` → `OpenAIProvider`, `FakeAIProvider`, gemini-stub.

---

## Mapper

**Qué es:** Función que traduce un contrato a otro (HTTP ↔ dominio, API ↔ DTO).

**Para qué:** Que el dominio no “hable JSON de la API” ni viceversa.

**Ejemplo:** pendiente detallar en Fases 4–5 (`HttpTutorEngine` / presenters).

---

## Composition root

**Qué es:** El único sitio que **elige e inyecta** implementaciones concretas (fake vs remote, storage real, etc.).

**Para qué:** Pantallas y casos de uso no hacen `new HttpTutorEngine()`; reciben dependencias ya cableadas.

**Ejemplo:** `frontend/src/bootstrap/dependencies.ts`, `createTutoringModule`, `composeTutoring(env)` en backend.

**Entrevista:** “Las pantallas no saben si el tutor es Fake o HTTP; el composition root decide con `EXPO_PUBLIC_TUTOR_MODE`.”

---

## `.npmrc` / `node-linker=hoisted`

**Qué es:** Configuración de pnpm en la raíz. `node-linker=hoisted` deja un `node_modules` plano (estilo npm) en lugar del layout estricto de symlinks de pnpm.

**Para qué:** Metro/Expo suelen resolver mejor dependencias nativas con layout hoisted.

**Trade-off:** a veces aparecen `.bin` locales rotos en un package; se repara reinstalando ese `node_modules`.

---

## Expo Go vs Dev Client

- **Expo Go:** app genérica. `expo start` (`pnpm dev`). Ideal para demos de la prueba.
- **Dev Client:** binario nativo del proyecto (`android/`). `pnpm start:dev-client` / `pnpm android`.

---

## Driving vs Driven adapters

- **Driving (inbound):** disparan el caso de uso — rutas Expo Router, controllers HTTP.
- **Driven (outbound):** salidas — `HttpTutorEngine`/`FakeTutorEngine`, AsyncStorage, `OpenAIProvider`.

---

## Dependency inversion

**Qué es:** “Depende de abstracciones, no de detalles.” El application pide un puerto; el composition root pone la implementación.

**Para qué:** Dominio y casos de uso no importan Expo ni OpenAI. Tests pueden usar fakes.

**Ejemplo:** `GenerateTutorResponse` usa `AIProvider`; en tests se inyecta `FakeAIProvider`.

---

## Hook

**Qué es:** Función React (`use…`) que encapsula estado y efectos de UI.

**Para qué:** Que la pantalla no contenga toda la orquestación (queries, envío, errores).

**Ejemplo:** `useTutorSession`, `usePreferences`, `useLearningProgress`.

---

## Store

**Qué es:** Estado compartido en el cliente (aquí Zustand), vivo fuera de un solo componente.

**Para qué:** Preferencias u otros datos que varias pantallas leen/escriben sin prop-drilling.

**Ejemplo:** `preferences-store.ts`.

---

## Query / Mutation

**Qué es (TanStack Query):**  
- **Query** = lectura cacheada (“dame la sesión”).  
- **Mutation** = escritura o acción con efecto (“envía este mensaje”).

**Para qué:** Cache, loading/error y refetch sin reinventarlo en cada hook.

**Ejemplo:** claves `TUTOR_SESSION_QUERY_KEY`, `RECENT_TUTORING_SESSIONS_QUERY_KEY` (detalle en Fase 7).

---

## Hidratación

**Qué es:** Al arrancar, leer lo persistido (AsyncStorage) y cargarlo en memoria (store).

**Para qué:** Que la UI no arranque “vacía” cuando ya había preferencias guardadas.

**Ejemplo:** `PreferencesHydrator` en `AppProviders`.

---

## Render / Memoización / Virtualización

**Qué es (React Native):**  
- **Render** = pintar la UI.  
- **Memoización** = evitar recalcular/repintar si no cambió lo relevante (`useMemo`, etc.).  
- **Virtualización** = solo montar filas visibles en listas largas (`FlashList`).

**Para qué:** Rendimiento en listas y pantallas densas. Ejemplos concretos en Fase 6.
