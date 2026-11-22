# Modelo de datos inicial

Esquema: apps/api/prisma/schema.prisma (propuesta, aún no aplicado a DB).

## Entidades
- Workspace: Profesor independiente o academia. Cada workspace mantiene marca, slug y zona horaria.
- User + WorkspaceMembership: identidad global y múltiples roles por espacio.
- TeacherProfile + CourseTeacher: profesor en uno o varios espacios; varias materias y cursos por profesor.
- Subject / Course / Topic: jerarquía flexible. El curso puede prescindir de una materia formal.
- Enrollment: alumno inscrito en un curso, incluso si está en otro curso simultáneamente.
- TeachingSession: clase virtual/presencial/híbrida, recursos y asistencia.
- LessonReflection / Practice / PracticeAttempt: ciclo de Clase Viva con revisión.
- SkillProgress: avance por tema con evidencia.
- Resource: material vinculado a una sesión, curso o tema y control de autorización para IA.
- ProviderConnection: referencia segura a token bajo un proveedor externo.

## Reglas antes del MVP real
1. Validar que Course, Subject, TeacherProfile, Resource y Session vinculados pertenezcan al mismo Workspace.
2. Asegurar que estudiante/docente tenga membership con permiso antes de crear Enrollment o asignación.
3. Para sesiones híbridas verificar ubicación y proveedor; controlar choques por docente, recurso y franja.
4. Implementar atomicidad de reservas/cupos y transiciones de estado.
5. Revisar índices, relaciones/cascade, consentimiento, auditoría y archivo histórico con datos reales.
6. No incluir credenciales ni materiales privados en el payload del alumno.
