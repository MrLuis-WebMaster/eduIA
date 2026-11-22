# Roadmap por entregables

## Etapa 0 — Foundation (esta rama)
- [x] Visión del producto, mapa de dominios, contrato inicial de sesiones.
- [x] Monorepo independiente bajo products/teacher-saas.
- [x] Interfaz interactiva con datos demo (sin autenticación real).
- [x] API de health, catálogo demo y validación de sesión.
- [x] Borrador relacional multi-tenant.
- [ ] Ejecutar CI de la rama y estabilizar dependencias.

## Etapa 1 — MVP comercial
- [ ] Auth, onboarding y workspace SOLO/ACADEMY con personalización.
- [ ] Memberships multiworkspace y roles/capabilities.
- [ ] CRUD de docentes, alumnos, materias, cursos, temas y grupos.
- [ ] Agenda por docente/sede con franjas horarias, conflictos y reservas.
- [ ] Sesiones virtuales, presenciales e híbridas; enlaces manuales.
- [ ] Aula Digital: materiales, tareas, asistencia y anuncios.
- [ ] Página pública, servicios, horarios y captación.
- [ ] Planes de pago y suscripciones con pasarela autorizada.
- [ ] Aislamiento multi-tenant, auditoría y pruebas E2E.

## Etapa 2 — Diferenciación
- [ ] Clase Viva: observaciones/audio -> borrador -> aprobación -> publicación.
- [ ] Pasaporte: objetivos, intentos y progreso respaldado por evidencia.
- [ ] Profe SOS: asistentes por materia, restricciones y derivación humana.
- [ ] Conectores Google Calendar/Meet, Zoom y Google Drive (OAuth real).
- [ ] Notificaciones y recordatorios consentidos.

## Etapa 3 — Academia avanzada
- [ ] Profe Studio: catálogo, ofertas digitales, planes, cupones y métricas.
- [ ] Grupos, cupos, sedes, docentes sustitutos, caja y facturación.
- [ ] Reportes, familias/acudientes, certificados, integraciones adicionales.
- [ ] Personalización por dominio y white-label ampliado.

## Criterios para pasar a producción
Migraciones, permisos verificados, políticas de privacidad, pruebas de resiliencia de los conectores, secretos seguros, accesibilidad y observabilidad.
