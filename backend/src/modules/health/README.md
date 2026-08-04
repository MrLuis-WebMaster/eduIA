# Module: health (backend)

Liveness de la API.

## Responsibility

Exponer un endpoint ligero para comprobar que el proceso Express responde.

## Public API

- `healthRouter` → montado en la app.

## HTTP

| Método | Ruta | Respuesta |
| --- | --- | --- |
| `GET` | `/api/v1/health` | `{ status: 'ok', service: 'eduia-api', timestamp }` |

Sin puertos ni env propios. Útil en runbooks de red/dispositivo: [device-cannot-reach-api](../../../../docs/runbooks/device-cannot-reach-api.md).
