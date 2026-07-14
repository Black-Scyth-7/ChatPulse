# Deployment — Vercel (production) (CHA-16)

The site is a standard Next.js 14 App Router app; Vercel auto-detects the
framework, the pnpm package manager (from `pnpm-lock.yaml`), and the build
command. No `vercel.json` is required — the defaults are correct.

## One-time project setup (Vercel dashboard)

1. **Import the repo.** Vercel → Add New → Project → import the GitHub repo.
   - Framework preset: **Next.js** (auto-detected).
   - Build command: `pnpm build` (default). Output: `.next` (default).
   - Install command: `pnpm install` (default, from the lockfile).
2. **Production branch.** Settings → Git → Production Branch = `main`. Every push
   to `main` ships to production; other branches get preview deployments.
3. **Environment variables.** Settings → Environment Variables (see
   `.env.example` for the full list). For the **Production** scope:
   - `NEXT_PUBLIC_SITE_URL` = `https://chatpulse.app` (or the assigned domain).
     Drives canonical/OG/sitemap absolute URLs.
   - `WAITLIST_WEBHOOK_URL` = your Zapier/Make/ESP/CRM endpoint. **Recommended**
     — see waitlist durability below.
   - `WAITLIST_DATA_FILE` — leave unset; it defaults to `/tmp/waitlist.jsonl` on
     Vercel automatically.
4. **Domain.** Settings → Domains → add `chatpulse.app`, follow the DNS steps,
   and set it as the primary/production domain.

## Waitlist durability in production

`POST /api/waitlist` persists to an append-only JSONL file. On Vercel only
`/tmp` is writable, and it is **ephemeral** (per serverless instance, wiped on
cold start). The app defaults `WAITLIST_DATA_FILE` to `/tmp/waitlist.jsonl` when
`process.env.VERCEL` is set, so signups succeed and dedupe within an instance's
lifetime — but for durable capture you **must** set `WAITLIST_WEBHOOK_URL` so
each confirmed signup is forwarded off-box. For a real backing store, implement
the `WaitlistStore` seam (Neon/Supabase Postgres or Vercel KV/Upstash) per
`docs/waitlist-integration.md`.

## Pre-ship verification (run locally or in CI)

```bash
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm lint        # next lint
pnpm test        # node --test
pnpm build       # must complete with no warnings
```

The production build must finish with **no warnings**. (The generated image
routes — `icon`, `opengraph-image`, `twitter-image` — run on the default Node
runtime so they prerender statically and don't emit the edge-runtime warning.)

## Post-deploy smoke test

Against the live production URL:

```bash
curl -sS https://chatpulse.app/api/health           # -> {"status":"ok",...}
curl -sS -X POST https://chatpulse.app/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"email":"smoke-test@example.com","source":"deploy-smoke"}'   # -> {"ok":true}
```

Also load `/`, `/blog`, a blog post, `/sitemap.xml`, and `/robots.txt`, and
submit the on-page waitlist form once.
