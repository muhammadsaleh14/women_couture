# shadcn/ui — run these locally (CLI only)

From the `frontend` folder, after `npm install`:

Imports in this project expect the **default** shadcn paths: `@/components/ui/*` and `@/lib/utils` (i.e. files under `src/components/` and `src/lib/`). Do not hand-copy component source from the docs—use the CLI only.

## 1. Initialize shadcn (creates `components.json`, `src/lib/utils.ts`, theme in `index.css`)

```bash
cd frontend
npx shadcn@latest init -t vite -y
```

If prompts appear, choose: **Tailwind v4**, **React 19**, **New York** style, **Stone** or **Neutral** base color, CSS variables, `@/components` path.

## 2. Add components used by the app

```bash
npx shadcn@latest add button card input label textarea badge table carousel dialog select switch radio-group separator sonner
```

The CLI will install any extra deps (e.g. Radix, `embla-carousel-react`, `tw-animate-css`, `sonner` for toasts).

## 3. Merge theme (optional)

After init, open `src/index.css` and ensure any custom theme file you use is imported **after** the lines the CLI added (see `src/styles/storefront-theme.css`).

## 4. Run the app

```bash
npm run dev
```

If `npm` reports lock/security errors, fix the lockfile or use `pnpm` / `bun` per your policy, then rerun the same `npx shadcn` commands.

**“No import alias found in tsconfig.json”:** The CLI reads the **root** [`tsconfig.json`](tsconfig.json). This repo sets `@/*` there (and in `tsconfig.app.json` for the app build). If you still see the error, ensure `compilerOptions.baseUrl` and `compilerOptions.paths` are present in the root `tsconfig.json`.
