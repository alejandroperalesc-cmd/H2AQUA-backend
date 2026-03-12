# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

H2AQUA is a wellness/spa web application for hydrogen molecular therapies. It consists of:
- **Backend**: Express + Prisma (SQLite) API in TypeScript, located at the repo root
- **Frontend**: React 19 + Vite SPA in TypeScript, located in `h2aqua-frontend/`

## Commands

### Backend (run from repo root)
```bash
npm run dev       # Development with ts-node (ts-node src/server.ts)
npm run build     # Compile TypeScript → dist/ (tsconfig.backend.json)
npm start         # Run compiled production server (node dist/server.js)
```

### Prisma
```bash
npx prisma migrate dev    # Apply migrations and regenerate client
npx prisma generate       # Regenerate client after schema changes
npx prisma studio         # Open Prisma Studio GUI
```

### Frontend (run from h2aqua-frontend/)
```bash
npm run dev       # Vite dev server on http://localhost:5173
npm run build     # Type-check + Vite build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

## Architecture

### Backend (`src/server.ts`)
All API routes live in a single file. Key route groups:
- `/clientes` — CRUD for clients
- `/servicios` — CRUD for therapy services
- `/productos` — CRUD + status management; `categoria` is `'ITEM'` or `'TERAPIA'`; `estado` is `'ACTIVO'`, `'AGOTADO'`, or `'INACTIVO'`
- `/productos-tienda` — store-visible products (ACTIVO + AGOTADO)
- `/terapias-disponibles` — products with `categoria='TERAPIA'` for appointment booking
- `/citas` — appointment CRUD; `estado` is `'PENDIENTE'`, `'CONFIRMADA'`, `'CANCELADA'`, `'COMPLETADA'`
- `/pedidos` — order creation with line items
- `/upload-imagen` — Multer file upload → saved to `/uploads/`, served statically
- `BASE_URL` env var controls the URL prefix for uploaded image URLs (defaults to `http://localhost:3000`)

Known tech debt: cita creation hardcodes `clienteId: 1` and `servicioId: 1`.

### Frontend (`h2aqua-frontend/src/`)
Single-page app with **no routing library** — view state is managed via a `Vista` type union in `App.tsx`. Views: `'home' | 'lista' | 'nuevo' | 'tienda' | 'citas' | 'citas-calendario'`.

Shopping cart state lives in `App` and is passed as props to `TiendaProductos`.

All API calls use `import.meta.env.VITE_API_URL` (set in `.env.development` / `.env.production`). There is an `api.ts` file but most fetches are inline in components.

Styling is done entirely with **inline styles** — no CSS-in-JS library or utility framework. The brand color palette uses tiffany/turquoise tones defined as constants at the top of each component file.

### Data Model (Prisma / SQLite)
- `Cliente` → has many `Cita`, `Pedido`
- `Servicio` → has many `Cita`
- `Producto` → has many `PedidoProducto`; `categoria` distinguishes items vs therapies
- `Cita` → belongs to `Cliente` + `Servicio`
- `Pedido` → belongs to `Cliente`, has many `PedidoProducto`
- `PedidoProducto` — join table between `Pedido` and `Producto` with `cantidad` + `precioUnit`

### Environment
| Variable | Dev | Production |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | `https://h2aqua-backend.onrender.com` |
| `BASE_URL` (backend) | `http://localhost:3000` | Set on Render |
| `DATABASE_URL` | SQLite file path | Set on Render |

CORS allows `http://localhost:5173` (dev) and `https://h2aqua.com.mx` (prod).
