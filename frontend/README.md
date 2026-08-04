# Frontend (EduIA)

Aplicación móvil Expo / React Native del monorepo EduIA.

## Docs

| Tema | Enlace |
| --- | --- |
| Índice | [docs/README.md](../docs/README.md) |
| Arranque | [getting-started](../docs/getting-started.md) |
| Env / modos del tutor | [environment](../docs/reference/environment.md) · [switch mode](../docs/how-to/switch-tutor-mode.md) |
| Arquitectura | [architecture](../docs/explanation/architecture.md) |
| Design system | [design-system](../docs/explanation/design-system.md) |
| Dispositivo físico | [how-to](../docs/how-to/run-on-physical-device.md) |

## Scripts útiles

```bash
pnpm --filter frontend dev              # Expo Go (QR)
pnpm --filter frontend start:dev-client # Development build nativo
pnpm --filter frontend android          # expo run:android
pnpm --filter frontend lint
pnpm --filter frontend typecheck
pnpm --filter frontend test
```

Lista completa: [reference/scripts](../docs/reference/scripts.md).
