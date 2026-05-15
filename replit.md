# AIComp — AI-Powered Electronics Comparison

India's smartest electronics comparison platform. Compares phones, tablets, laptops and more with real-time prices, spec tables, and AI-powered verdicts.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at `/api`)
- `pnpm --filter @workspace/web run dev` — run the React frontend (port 22333, served at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Wouter + TanStack Query + Lucide
- API: Express 5 (mounted at `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/api-client-react/` — generated React Query hooks (do not edit)
- `lib/api-zod/` — generated Zod schemas (do not edit)
- `lib/db/src/schema/` — Drizzle ORM table definitions
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/web/src/pages/` — React page components
- `artifacts/web/src/components/` — Shared UI components
- `artifacts/web/src/index.css` — AIComp design system (GSMArena-style dark theme)

## Architecture decisions

- **Contract-first API**: All endpoints defined in OpenAPI spec first, then codegen generates typed hooks and Zod schemas. Never write raw fetch calls on the frontend.
- **AIComp design system**: Uses CSS custom properties (`--bg`, `--blue`, `--green`, etc.) on top of Tailwind v4. Existing shadcn/ui components work alongside custom CSS classes (`.product-card`, `.site-header`, `.compare-table`, etc.).
- **Route prefix**: Express router is mounted at `/api`, so route handlers use `/v1/...` paths (not `/api/v1/...`).
- **Codegen naming**: Operations with BOTH path params AND query params create colliding `*Params` types. Fixed by removing query params from those operations (`fetchBrandProducts`, `fetchCategoryProducts`, `listSimilarProducts`).
- **No auth middleware yet**: Auth routes exist but token verification is a simple base64 decode. Should be replaced with JWT for production.

## Product

- **Home**: Trending ticker, hero banner, featured/trending phones, flash deals, upcoming launches
- **Product Detail**: Full specs, price comparison table, similar products, wishlist/compare actions
- **Compare**: Add up to 4 devices, side-by-side spec table, AI verdict via POST `/api/v1/compare/ai-verdict`
- **Search**: Full-text search with autocomplete dropdown
- **Category / Brand pages**: Filtered product grids
- **Deals**: Flash deals and all deals listing
- **Launches**: Upcoming phones grid
- **Guides**: Buying guide articles

## User preferences

- Keep the exact same GSMArena-style dark theme (CSS vars: `--bg: #1a1d27`, `--blue: #4a9eff`, `--green: #3db87a`, `--orange: #f0883e`)
- Do NOT redesign or switch to a different UI library — preserve the existing inline CSS system
- Currency: Indian Rupee (₹), prices in INR

## Gotchas

- **Run codegen before typechecking** after any OpenAPI spec changes: `pnpm --filter @workspace/api-spec run codegen`
- **Push DB schema after schema changes**: `pnpm --filter @workspace/db run push`
- **Restart API server after route changes** — it runs `pnpm run build && pnpm run start`, so file changes need a workflow restart
- Do not run `pnpm dev` at the workspace root — use workflow restarts

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Admin panel routes available at `/api/v1/admin/*` (no auth enforced yet — add middleware before prod)
- Crawler job queue at `POST /api/v1/admin/crawler/trigger`
- Bulk import at `POST /api/v1/admin/products/bulk-import`
