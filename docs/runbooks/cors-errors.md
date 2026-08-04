# Runbook: errores CORS

## Síntomas

- En web (o cliente que envía `Origin`), el navegador bloquea la request a la API.
- Mensaje típico: *blocked by CORS policy* / *No 'Access-Control-Allow-Origin'*.
- Health o tutor fallan solo desde un origen distinto al configurado.

## Contexto

CORS se configura en `backend/src/app.ts` con:

```bash
CORS_ORIGIN=*   # default
```

Con `*`, la mayoría de orígenes están permitidos. Un valor concreto (p.ej. `http://localhost:8081`) rechaza el resto.

## Chequeos

1. Valor actual de `CORS_ORIGIN` en `backend/.env`.
2. Origen real del cliente (Expo web, otro puerto, dominio).
3. ¿El backend reinició tras cambiar env?
4. Distingue CORS de red: si `curl` a health funciona pero el browser no, es CORS/origen.

## Resolución

**Desarrollo local:**

```bash
CORS_ORIGIN=*
```

O el origen exacto del Metro/web:

```bash
CORS_ORIGIN=http://localhost:8081
```

Reinicia `pnpm dev:backend`.

**Producción:** fija orígenes explícitos (nunca secretos en el repo). Documenta el valor en el entorno desplegado; no uses `*` si hay cookies/credenciales (hoy la API no usa cookies de sesión).

Env: [reference/environment.md](../reference/environment.md).
