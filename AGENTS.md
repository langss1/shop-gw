<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project-specific agent notes

## Skills

Two project skills live in `.claude/skills/`:

- **verify-crud** — end-to-end check of App/Banner create/edit/delete through the
  admin UI, confirming changes land in the storefront and `/api/v1/*`, with cleanup of
  test data. Run this after any change touching `src/lib/actions/`, admin forms, or the
  DB schema.
- **pre-commit-check** — lint + build, then a visual pass over the storefront and admin
  at mobile/tablet/desktop widths via the browser, flagging layout regressions and
  console errors. Run this before proposing a commit for UI/component changes. It never
  commits or pushes on its own.

Both skills drive the browser via the `claude-in-chrome` MCP tools (already available —
no extra MCP setup needed for this).

## Supabase access

No Supabase MCP server is configured in this repo — all database access from Claude
goes through the existing app code path: `src/lib/actions/*.ts` (Server Actions) and
`src/lib/queries.ts`, which run under the logged-in admin's JWT and Postgres RLS (see
`supabase/migrations/0001_init.sql`). Do not add a service-role client as a shortcut.
If direct SQL/table access via MCP is wanted later, it requires a Supabase Personal
Access Token supplied by the user through an env var (never pasted into chat) — ask
before assuming it's available.

## Git / commits

Commits and pushes are manual/on-request only — there is no auto-commit or auto-push
hook configured for this repo. Don't set one up without the user explicitly asking
again and specifying the trigger (per-task vs. per-file-change) and whether push is
included.

## Responsiveness

Mobile layout (storefront header/carousel, app grid, admin forms) is in good shape as
of 2026-08. Desktop/tablet breakpoints (≥768px) get comparatively less attention —
check them explicitly (e.g. via `pre-commit-check`) rather than assuming a mobile-first
change also looks right wider.
