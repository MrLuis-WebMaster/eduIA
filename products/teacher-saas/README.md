# Academia OS (nombre provisional)

Plataforma SaaS white-label para profesores independientes y academias. Un profesor puede impartir múltiples materias y pertenecer a varios espacios; cada espacio personaliza marca, catálogo, agenda y experiencias de aprendizaje.

> Estado: foundation/demo en una rama aislada de EduIA. No está desplegado ni listo para producción. La aplicación web usa datos de demostración y el API no persiste información todavía.

## Producto

- **Operación:** espacios SOLO/ACADEMY, docentes, alumnos, materias, programas, grupos, cursos, temas, agenda y reservas.
- **Sesiones:** ONLINE, ONSITE o HYBRID; videollamadas Meet/Zoom/enlace propio; sedes y aulas.
- **Clase Viva:** observaciones de sesión -> propuesta de resumen y prácticas -> aprobación docente -> intento del alumno.
- **Pasaporte:** objetivos, habilidades, evidencias de progreso y próximos pasos.
- **Profe Studio:** página/marca, ofertas, planes y recursos.
- **Profe SOS:** ayuda educativa con límites y supervisión.
- **Conectores:** Google Calendar/Meet, Zoom, Google Drive; OneDrive/Dropbox en etapas posteriores.

## Estructura

- apps/web: Vue 3 + Vite, dashboard prototipo responsive con interacciones locales.
- apps/api: NestJS, endpoints de prueba y validación de sesiones.
- apps/api/prisma: modelo relacional multi-tenant orientativo (no migrado).
- docs: visión, ADR inicial, flujos, seguridad, integraciones y entregables.

## Primer arranque

Requiere Node.js 20+ y pnpm. Desde esta carpeta:
1. pnpm install
2. pnpm dev
3. Web: http://localhost:5173
4. API: http://localhost:3001/api/v1/health

Pruebas: pnpm test
Construcción: pnpm build

No hacen falta credenciales OAuth para el prototipo. Los conectores están representados visualmente; **no** crean reuniones ni acceden a cuentas reales. Para probar la API de validación de sesiones: POST /api/v1/bookings/validate.

## Decisiones

- Nombre, branding y precios no están definidos definitivamente.
- Separación estricta de espacios; los roles deben validarse en backend antes de implementar la capa de persistencia.
- No se subirán tokens, credenciales, grabaciones ni datos reales de alumnos al repositorio.
- Más detalle: docs/vision.md, docs/architecture.md, docs/roadmap.md, docs/integrations.md.

## Contexto de repositorio

Se creó dentro de una rama separada de EduIA porque la conexión de GitHub actual no expone la operación de crear un repositorio nuevo. Este directorio está preparado para extraerse como monorepo independiente en el futuro.
