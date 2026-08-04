# Referencia: API HTTP

Fuente de verdad del contrato HTTP del backend. El README enlaza aquí; no duplicar tablas.

Base URL por defecto: `http://localhost:3001` (ver `PORT` en [environment.md](./environment.md)).

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/v1/health` | Liveness |
| `POST` | `/api/v1/tutor/messages` | Genera respuesta del tutor |

## `POST /api/v1/tutor/messages`

Body validado con Zod:

| Campo | Notas |
| --- | --- |
| `message` | Mensaje del usuario |
| `subject` | Materia |
| `difficulty` | Dificultad |
| `userRole` | Rol (estudiante/docente) |
| `conversation` | Historial; máximo 10 mensajes |

### Errores normalizados

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "retryable": true,
    "requestId": "string"
  }
}
```

### Timeouts y límites

- Timeout del proveedor de IA: `AI_REQUEST_TIMEOUT_MS` (default `20000`).
- Rate limit en la ruta del tutor: `TUTOR_RATE_LIMIT_WINDOW_MS` / `TUTOR_RATE_LIMIT_MAX`.
- Payload JSON máximo: `32kb`.

## Seguridad (resumen)

- `helmet`, CORS configurable (`CORS_ORIGIN`), `x-powered-by` deshabilitado.
- Validación de entrada con Zod.
- Política pedagógica en dominio para acotar tono y alcance.
- Secretos solo vía variables de entorno.

Detalle de env: [environment.md](./environment.md). Decisiones de alcance: [ADR](../adr/).
