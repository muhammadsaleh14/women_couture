# Women Couture

Monorepo for the Women Couture SaaS (backend API now; frontend to follow).

## Prerequisites

- Node.js 20+ (LTS recommended)
- Docker Desktop (or Docker Engine) for local PostgreSQL

## Database (development)

From the repository root, start PostgreSQL:

```bash
docker compose up -d
```

This exposes Postgres on `localhost:5432` with user `postgres`, password `postgres`, and database `women_couture` (see [docker-compose.yml](docker-compose.yml)).

Set `JWT_SECRET` in [backend/.env.example](backend/.env.example) (at least 32 characters). After migrations, seed a default admin user (override with `ADMIN_USERNAME` / `ADMIN_PASSWORD`):

```bash
cd backend
npm run db:seed
```

## Backend API

Location: [backend/](backend/)

1. Copy environment file:

   ```bash
   cd backend
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   cd backend
   Copy-Item .env.example .env
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Generate Prisma Client and apply migrations:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. Start the API in development mode:

   ```bash
   npm run dev
   ```

The server listens on `http://localhost:3000` by default (override with `PORT` in `.env`).

### Useful endpoints

- `GET /health` — health check
- `POST /api/v1/auth/register` — register (role `CUSTOMER` only)
- `POST /api/v1/auth/login` — JWT (`{ "username", "password" }`)
- `GET /api/v1/auth/me` — current user (Bearer token)
- `POST /api/v1/echo` — example JSON body validation (`{ "message": "..." }`)
- `GET /openapi.json` — OpenAPI 3 document (for codegen)
- `GET /api-docs` — Swagger UI

### Export OpenAPI for the frontend

Writes `backend/openapi/openapi.json` (no running server required):

```bash
cd backend
npm run openapi:export
```

Point **openapi-typescript-codegen**, **Orval**, or similar at that file to generate a typed client for the React app.

## Frontend (Vite + React)

Location: [frontend/](frontend/)

UI primitives come from **shadcn/ui** (installed via CLI, not hand-written). After `npm install` in `frontend/`, run the commands in [frontend/SHADCN_COMMANDS.md](frontend/SHADCN_COMMANDS.md) (`shadcn init`, then `shadcn add …`). That generates `src/components/ui`, `src/lib/utils.ts`, and theme CSS.

Copy [frontend/.env.example](frontend/.env.example) to `frontend/.env` and set `VITE_API_URL` to your API (e.g. `http://localhost:3000`).

Then start the app:

```bash
cd frontend
npm run dev
```

- Customer storefront: `/` (home, shop, product, cart)
- Sign in: `/login` (JWT stored in `localStorage`; admins go to the dashboard after login)
- Admin: `/admin` (requires `ADMIN` role; **Inventory** links to the same catalog for now)

## Project layout

- [backend/](backend/) — Express + TypeScript, Prisma, Zod, zod-to-openapi, Swagger UI
- [frontend/](frontend/) — React storefront + admin prototype (mock data; OpenAPI client later)
- [docker-compose.yml](docker-compose.yml) — development PostgreSQL
