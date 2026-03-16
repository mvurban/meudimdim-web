# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**MeuDimDim** — web frontend for a personal financial wealth management system. For full domain specification (concepts, modules, business rules), read **README.md**.

This repo (`meudimdim-web`) is the Next.js frontend only. The backend API lives in a separate `meudimdim-api` repo.

## Commands

```bash
npm run dev        # Next.js dev server
npm run build      # production build
npm run lint       # lint
```

To run the full stack:
```bash
docker-compose -f docker/docker-compose.yml up
```

## Architecture

### Frontend structure
```
src/
├── app/
│   ├── (auth)/login/       ← Google OAuth login
│   └── (app)/              ← protected routes
│       ├── dashboard/
│       ├── produtos/
│       ├── acoes/
│       ├── instituicoes/
│       ├── cotacoes/
│       └── admin/
├── components/
│   ├── ui/                 ← shadcn/ui
│   ├── charts/             ← Recharts wrappers
│   ├── products/
│   ├── stocks/
│   └── layout/
└── lib/
    ├── api.ts              ← single HTTP client for all API calls
    └── auth.ts             ← NextAuth v5 config
```

### Key constraints
- **No direct DB access** — all data comes from the API
- **No calculations on the frontend** — computed fields (`renda`, `valorFinal`, `valorBRL`, `valorUSD`) are returned by the API; the frontend only displays them
- All reference tables (Categories, AssetClasses, Institutions) are **per-user**, never global

### Auth flow
NextAuth v5 with Google OAuth. On first login, the frontend calls `POST /auth/register` on the API to auto-register the user.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Auth | NextAuth v5 + Google OAuth |
| UI | Tailwind CSS + Radix UI + shadcn/ui |
| Charts | Recharts |
| Infra | Docker + docker-compose + .devcontainer |
