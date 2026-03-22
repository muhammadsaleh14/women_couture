# How the API, OpenAPI, Swagger UI, and the frontend client fit together

This document explains the pieces in plain language. You do **not** need prior knowledge of OpenAPI, Orval, or Swagger.

---

## What problem are we solving?

Your **backend** is a web server: it exposes **URLs** (for example `GET /api/v1/auth/me`) that accept **JSON** and return **JSON**.

Your **frontend** (React) needs to call those URLs in a **type-safe** way: TypeScript should know the shape of request bodies and responses, and you want reusable hooks (TanStack Query) instead of copying URLs everywhere.

The pieces below connect **backend routes** → **one machine-readable description** → **generated TypeScript** that your app imports.

---

## 1. The HTTP API (what you actually run)

When you start the backend (`npm run dev` in `backend/`), Express listens on a port (often `http://localhost:3000`). Browsers and your React app send **HTTP requests** to paths like:

- `GET /health` — is the server up?
- `POST /api/v1/auth/login` — send username/password, get a token and user info
- `GET /api/v1/auth/me` — who am I? (send the token in the `Authorization` header)

That is the **real** API. Everything else (OpenAPI, Swagger UI, Orval) is **documentation and tooling** built *around* that API.

---

## 2. OpenAPI (formerly “Swagger spec”) — a **description** of the API

**OpenAPI** is a standard **format** (usually JSON) that answers questions like:

- Which paths exist?
- Which HTTP methods (`GET`, `POST`, …)?
- What JSON body does each endpoint expect?
- What JSON does it return? Which status codes?

Think of it as a **table of contents + schema** for your API, readable by **humans and tools**.

In this project, the canonical file is:

`backend/openapi/openapi.json`

It is **generated**, not written by hand as a separate “Swagger YAML” project. The backend builds it from the same validation rules you use in routes (Zod). So the description stays aligned with what the server actually does.

---

## 3. Swagger UI — a **browser page** that reads that description

**Swagger UI** is a small web app that:

1. Loads an OpenAPI document (often `openapi.json`).
2. Renders a **clickable list** of endpoints: you can try requests from the browser (useful for debugging).

In this backend, something like `GET /api-docs` (and often `GET /openapi.json`) serves the spec and the UI. That helps you **explore** the API without writing frontend code.

**Important:** Swagger UI does **not** power your React app. It is a **developer tool** next to the real API.

---

## 4. Orval — **code generator** from OpenAPI → TypeScript

**Orval** is a command-line tool. You point it at `openapi.json` and it **writes TypeScript files** (in our case under `frontend/src/api/generated/`).

Those files include:

- **Types** for bodies and responses (e.g. `UserPublic`, `LoginBody`).
- **Functions** that perform the HTTP call (through your Axios setup).
- **TanStack Query hooks** like `useGetApiV1AuthMe`, `usePostApiV1AuthLogin`, etc.

So instead of manually typing `fetch('/api/v1/auth/me')` and guessing types, you **import generated hooks** that already match the spec.

---

## 5. Why a “mutator” (`orval-mutator.ts`) and `api.ts`?

Orval can generate plain `fetch` or Axios calls. We use **Axios** and a single shared client in `frontend/src/lib/api.ts` that:

- Sets the **base URL** (e.g. `VITE_API_URL`).
- Attaches the **Bearer token** from `localStorage` on each request.

The **mutator** (`frontend/src/lib/orval-mutator.ts`) tells Orval: “Every generated request must go through **this** Axios instance.” That way **one** place controls auth and base URL.

---

## 6. How the backend produces `openapi.json` (high level)

Rough pipeline:

1. **Zod** schemas describe JSON shapes (e.g. login body, public user) in TypeScript.
2. `backend/src/openapi/register-paths.ts` **registers** each route (path, method, request/response schemas) with the OpenAPI registry.
3. A script **generates** the document and writes `backend/openapi/openapi.json`.
4. You run **`npm run openapi:export`** in `backend` to refresh that file when routes change.

So you are **not** maintaining a separate Swagger document by hand; you maintain **routes + Zod** and **glue** (`registerPath` blocks).

---

## 7. End-to-end workflow (what to run when)

When you **change** a route or its request/response shapes on the backend:

1. **Export the spec** (backend):

   ```bash
   cd backend
   npm run openapi:export
   ```

2. **Regenerate the frontend client** (frontend):

   ```bash
   cd frontend
   npm run api:generate
   ```

3. **Commit** the updated `openapi.json` (backend) and generated files (frontend) if your team tracks them in git—then fix any TypeScript errors where the API shape changed.

---

## 8. How this shows up in the React app

- `AppProviders` wraps the app with **TanStack Query**’s `QueryClientProvider` so hooks work.
- Auth uses generated hooks (e.g. current user query, login mutation) from `src/api/generated/api.ts`, still using the same Axios + token behavior via the mutator.

---

## Quick glossary

| Term | One-line meaning |
|------|------------------|
| **REST / HTTP API** | Real URLs your server serves. |
| **OpenAPI** | Standard JSON/YAML **description** of those URLs and payloads. |
| **Swagger UI** | Browser **explorer** for that description; dev tool, not the app. |
| **Orval** | Tool that **generates** TypeScript + React Query from OpenAPI. |
| **Mutator** | Hook that routes all generated calls through your **Axios `api`** instance. |

---

## Where to look in the repo

| Piece | Location |
|-------|----------|
| OpenAPI registration (paths + Zod) | `backend/src/openapi/register-paths.ts` |
| Zod auth shapes | `backend/src/routes/auth-schemas.ts` |
| Exported spec | `backend/openapi/openapi.json` |
| Orval config | `frontend/orval.config.ts` |
| Generated client + hooks | `frontend/src/api/generated/api.ts` |
| Shared Axios + token | `frontend/src/lib/api.ts` |
| Orval → Axios bridge | `frontend/src/lib/orval-mutator.ts` (or similar name) |

If you add a new endpoint, you usually: implement the route → register it in OpenAPI → export → run Orval → use the new hook in React.
