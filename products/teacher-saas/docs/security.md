# Seguridad, privacidad y condiciones previas

- Los ejemplos no contienen datos reales de alumnos. Nunca subir tokens de OAuth ni secretos a git.
- Cada operación requiere autenticación, membership y autorización por workspace; evitar IDOR y fugas entre espacios.
- Modelar permisos separados OWNER/ADMIN/TEACHER/STUDENT/GUARDIAN y acceso mínimo a recursos.
- Registrar cambios de agenda, pagos, materiales y accesos administrativos.
- Para menores: consentimiento y representación legal cuando corresponda, minimización, eliminación/exportación y controles de tutores.
- Grabar/transcribir requiere información clara, consentimiento según normativa y posibilidad de no participar.
- Los prompts de IA reciben solo datos autorizados; revisar retención de proveedores, no entrenar modelos con datos de alumnos por defecto.
- Propuestas IA deben etiquetarse como borradores y revisarse por un docente antes de publicarse.
- Backups, cifrado en tránsito/en reposo, borrado seguro, secretos en secret manager.
- CI: análisis de dependencias, pruebas de límites y lint. Antes de producción: threat model y revisión legal local.
