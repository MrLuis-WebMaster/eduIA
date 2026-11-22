# Visión y alcance del producto

## Clientes
1. Profesor individual con distintas materias y servicios (clases, asesorías, preparación de examen).
2. Academia con sedes, equipos docentes, grupos y asignaciones.
3. Profesor miembro de una academia que también tiene un espacio personal (pertenencia múltiple sin mezclar alumnos ni datos).

## Actores
Propietario, administrador, docente, alumno, acudiente (futuro) y visitante.

## Arquitectura conceptual de experiencia
- Backoffice: gestión comercial, reservas, alumnos, docentes, sesiones, pagos, reportes.
- Portal del alumno: aula digital, horario, materiales, tareas, prácticas y Pasaporte.
- Página pública: marca, cursos, precios, disponibilidad y checkout (posterior).
- IA educativa: Clase Viva, Profe SOS, progreso guiado, con aprobación y límites.

## Dominio adaptable
Espacio > Materia > Curso/Servicio > Unidad/Tema > Sesión > Actividad.
Una materia puede contener varios cursos, y un docente puede enseñar varias materias; un curso puede tener varios docentes. Una sesión puede ser individual o grupal, virtual, presencial o híbrida. El temario es opcional para asesorías de una sola sesión.

## Diferenciación
La misma fuente de información alimenta gestión de sesiones, Aula Digital, Clase Viva, Pasaporte y Profe SOS. Los alumnos pueden continuar aprendiendo entre sesiones; el profesor conserva el control pedagógico.

## Principios
- Configuración simple, móvil primero y funciones activables por espacio.
- Personalización por marca/colores/slug, sin despliegue individual por profesor.
- IA como asistente; revisión humana cuando se publica contenido educativo.
- Configuración regional: zona horaria por espacio y por usuario, precios en COP u otras monedas, horarios locales.
- Consentimiento específico para datos de menores, grabaciones y uso de IA.
- No se promete que un conector externo pueda hacer algo sin revisar sus permisos y API.
