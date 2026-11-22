# Arquitectura (ADR-0001, propuesta)

Estado: Proposed — antes de producción requiere revisión y aceptación.

## Stack
- Frontend: Vue 3, TypeScript, Vite, PWA cuando la UX y cache estén definidas.
- Backend: NestJS modular, REST, validación explícita y jobs idempotentes.
- Datos: PostgreSQL, Prisma como primera propuesta; migrations versionadas.
- Colas (futuro): Redis/BullMQ para recordatorios, IA y sincronización de conectores.
- Archivos: referencias externas o almacenamiento compatible con S3 por espacio.
- Auth (futuro): identidad global, memberships por workspace, sesiones y RBAC.

## Límites
- Workspace: configura marca, plan, políticas, módulos y zona horaria.
- Identity & Access: persona puede tener múltiples roles y workspaces; jamás usar un workspaceId enviado por cliente sin autorizarlo.
- Catalog: subjects, courses, topics, teachers, enrollments.
- Scheduling: sessions, bookings, attendance, locations, external meetings.
- Learning: reflections, tasks, assessments, practice attempts, skill progress.
- Commerce: offerings, subscriptions, invoices, payments (planificado).
- Integrations: OAuth connections, consent, provider adapters, events/retries.
- AI: content proposal -> review -> publish. No publicación silenciosa.

## Regla de aislamiento
Cada lectura/escritura debe resolver actor + membership + workspace activo y verificar permisos y pertenencia de recursos. Toda consulta de recurso por ID necesita scope del workspace. Auditoría en mutaciones sensibles. Las FK actuales del esquema son un borrador: endurecer con constraints y tests de aislamiento antes de persistencia real.

## Agenda y reuniones
Guardar en UTC, mostrar en zona local IANA. Separar Session de MeetingLink y ProviderConnection. Replanificación debe actualizar calendario y reunión externos mediante outbox o jobs reintentables y reconciliación. No enviar enlaces antes de confirmación.

## Webhooks/conectores
Validación de firmas y nonce si aplica, cifrado de tokens en reposo, scopes mínimos, rotación, reautorización, revocación, retry exponencial e idempotency key. No guardar tokens en el frontend.

## No objetivos MVP
Videollamada propia, editor LMS completo, generación automática de evaluaciones de alto impacto, marketplace de docentes, entrenamiento custom de modelos, app nativa separada por cliente.
