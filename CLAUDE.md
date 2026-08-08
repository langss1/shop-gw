# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

Gilang Store — an app storefront (Next.js 16 + React 19 + Tailwind 4) backed by
Supabase, with a bundled admin panel for managing content. Repo is primarily
Indonesian-language in comments/docs; README.md (Indonesian) has full setup details.

- **Storefront** `/` — app list, banner carousel, detail panel, Install button.
- **Admin** `/admin` — CRUD for apps (icon/screenshot/release file uploads) and banners.
- **Public API** `/api/v1/*` — same data as JSON.

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # run production build
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
```

No test suite is configured in this repo.

## Environment / database

- Env vars live in `.env.local` (see `.env.example`): `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Read via `src/lib/supabase/config.ts`, which
  also falls back to `NEXT_PUBLIC_SUPABASE_ANON_KEY` for older key naming.
- **No service-role key is used anywhere.** All writes go through the logged-in admin's
  JWT and are enforced by Postgres RLS — never add a service-role client as a shortcut.
- Schema lives in `supabase/migrations/0001_init.sql` (run manually in the Supabase SQL
  editor / CLI — there's no migration runner wired up). Key pieces:
  - `profiles` (role `admin`/`viewer`, auto-created via `handle_new_user` trigger)
  - `is_admin()` — `SECURITY DEFINER` helper every write policy depends on
  - `apps`, `app_screenshots`, `app_links`, `banners`
  - Storage buckets `app-media` (icons/screenshots/banner images) and `app-releases`
    (downloadable files)
  - `apps_published_needs_download` check constraint: a `published` app must have
    `download_url` or `download_file_path` set
- `supabase/seed.sql` has optional sample data.
- To make a user an admin: create them in Supabase Auth, then
  `update public.profiles set role = 'admin' where email = '...'`.

## Architecture

**Auth/admin guard is two-layered:**
1. `src/proxy.ts` (Next 16 renamed `middleware` → `proxy`) refreshes the Supabase
   session cookie and redirects unauthenticated requests away from `/admin/*` to
   `/admin/login`. It does **not** check role — only that a user is logged in.
2. `src/app/admin/(protected)/layout.tsx` calls `requireAdmin()` from `src/lib/admin.ts`,
   which checks `profiles.role === 'admin'` and redirects otherwise. `src/lib/admin.ts`
   also exports `getAdminOrNull()` for Server Actions that want to return an error
   instead of redirecting.
3. RLS in Postgres is the actual last line of defense for both reads and writes —
   route/action-level checks are UX, not the security boundary.

The `(protected)` route group holds every logged-in admin page; `admin/login` sits
outside it deliberately so proxy.ts can allow it through.

**Data flow:**
- `src/lib/supabase/client.ts` / `server.ts` — browser vs. server Supabase clients
  (`@supabase/ssr`). Server Components/Actions/route handlers use the server client;
  it's async (`await createClient()`) because Next 16 makes `cookies()` async.
- `src/lib/queries.ts` — read queries for the public storefront (published apps only).
- `src/lib/actions/{apps,banners,auth}.ts` — Server Actions for all admin mutations.
- `src/lib/supabase/upload.ts` — helpers for uploading to the `app-media` /
  `app-releases` storage buckets.
- `src/app/api/v1/*` and `src/app/api/download/[slug]` — public JSON API and the
  download redirect (increments `download_count` via the `increment_download()` SQL
  function, then redirects to the release file or external URL).

**Storefront composition:** `src/app/page.tsx` (Server Component) fetches apps +
banners and passes them to `src/components/Storefront.tsx`, which owns the active
platform-tab state and renders `MobileHeader.tsx` (banner carousel + platform tabs) and
`AppStoreGrid.tsx` (app cards + detail panel).

**Shared domain logic:** `src/lib/constants.ts` holds the platform/category/gradient
option lists (must stay in sync with the DB check constraints in
`0001_init.sql`) plus small helpers — `youtubeEmbedUrl`, `formatBytes`, `slugify`.
`src/lib/types.ts` holds the shared TypeScript types (`Profile`, `Platform`,
`AppLinkType`, etc.) mirroring the DB schema.

**Images:** `next.config.ts` derives the Supabase storage hostname from
`NEXT_PUBLIC_SUPABASE_URL` and whitelists it under `images.remotePatterns` for
`next/image`.

## Next.js 16 notes

This project pins `next@16.3.0`, which has breaking changes vs. earlier Next.js
versions — see `node_modules/next/dist/docs/` before assuming older APIs/conventions
apply (this is enforced by `AGENTS.md`, imported above). Notably in this codebase:
- `middleware.ts` → `proxy.ts` (exported function is `proxy`, not `middleware`).
- `cookies()`, `params`, and `searchParams` are async — always `await` them.
