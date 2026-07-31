# EduIA

AI tutoring companion for the Muyu take-home challenge. Mobile app (Expo) + Express API in a pnpm monorepo.

## Stack

- **Frontend:** Expo SDK 57, Expo Router, TypeScript, React Native
- **Backend:** Express, TypeScript (stateless API)
- **Package manager:** pnpm workspaces

## Screens (P0)

| Tab       | Purpose                                      |
| --------- | -------------------------------------------- |
| Tutor     | Chat with AI tutor (subject / difficulty)    |
| Progreso  | Local learning progress metrics              |
| Perfil    | User preferences, role, theme                |

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+
- Expo Go (optional, for device testing)

## Quick start

```bash
pnpm install
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
pnpm dev
```

- Frontend: Expo Metro (scan QR or press `w` for web)
- Backend: `http://localhost:3001/api/v1/health`

Useful scripts:

```bash
pnpm dev:frontend   # Expo only
pnpm dev:backend    # API only
pnpm lint
pnpm typecheck
pnpm test
```

## Workspace layout

```text
EduIA/
├── frontend/   # Expo React Native app
├── backend/    # Express TypeScript API
├── package.json
└── pnpm-workspace.yaml
```

## Environment

See `frontend/.env.example` and `backend/.env.example`. Never commit real secrets.

## Status

Day 1 foundation: monorepo, three tabs, Express health endpoint. Design system, tutoring AI, and progress features land in later days.
