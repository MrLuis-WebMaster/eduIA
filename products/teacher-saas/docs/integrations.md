# Plan de integraciones

## Google Calendar + Meet
Google OAuth por profesor o cuenta institucional con permisos apropiados. Crear/modificar/cancelar un evento de Calendar y solicitar conferenceData de Meet. Persistir IDs externos y enlace confirmado. Gestionar scopes mínimos, consentimiento, renovación de tokens, revocación y duplicados.

## Zoom
Conexión OAuth del propietario de la cuenta (o instalación institucional donde aplique). Reuniones create/update/delete, join URL, límites de anfitrión y licenciamiento. No asumir que el plan permite todas las capacidades; seguir condiciones de Zoom.

## Google Drive
Google Picker para selección explícita de documentos, metadatos y enlaces; scopes mínimos. Referenciar recurso por provider/fileId; validar acceso al abrirlo. No copiar materiales ni enviarlos a IA sin permiso.

## Opciones iniciales
- Reunión: Meet | Zoom | enlace manual.
- Material: Drive | archivo cargado | enlace externo.
- Agenda: calendario interno + sincronización Google Calendar cuando el proveedor esté conectado.
- Presencial: sede/ubicación, instrucciones de llegada, aula.
- Híbrida: ubicación y enlace por alumno según su modalidad.

## Más adelante
Microsoft Outlook/Teams, OneDrive, Dropbox, Zoom recordings, pasarelas de pago. Cada nueva integración requiere pruebas E2E de consentimiento, límites y desconexión.

## Estados recomendados
NOT_CONNECTED -> CONNECTING -> CONNECTED -> EXPIRED/ERROR/REVOKED.
Todas las pantallas deben decir claramente si una integración es demo o real.

## Seguridad
Tokens cifrados en backend, jamás en logs ni URLs públicas. Acceso mínimo por usuario; conexión individual o institucional diferenciada. Para alumnos menores proteger enlaces y adjuntos con autorización y vencimiento apropiado.
