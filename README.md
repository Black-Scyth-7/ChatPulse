# ChatPulse Site

Marketing site and blog for **ChatPulse** — real-time conversation insights.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and an
**MDX**-powered blog.

## Tech stack

| Concern         | Choice                                             |
| --------------- | -------------------------------------------------- |
| Framework       | [Next.js 14](https://nextjs.org) (App Router, RSC) |
| Language        | TypeScript (strict)                                |
| Styling         | Tailwind CSS + `@tailwindcss/typography`           |
| Content / blog  | MDX via `next-mdx-remote` + `gray-matter`          |
| Linting         | ESLint (`next/core-web-vitals`)                    |
| Formatting      | Prettier (+ `prettier-plugin-tailwindcss`)         |
| Package manager | [pnpm](https://pnpm.io)                            |

## Prerequisites

- **Node.js** 18.18+ (Node 20+ recommended)
- **pnpm** 8+ (`npm install -g pnpm`)

## Getting started

```bash
# Install dependencies
pnpm install

# Start the dev server (http://localhost:3000)
pnpm dev
```

## Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | Start the local dev server on port 3000  |
| `pnpm build`        | Create a production build                |
| `pnpm start`        | Serve the production build               |
| `pnpm lint`         | Run ESLint                               |
| `pnpm typecheck`    | Type-check with `tsc --noEmit`           |
| `pnpm format`       | Format the codebase with Prettier        |
| `pnpm format:check` | Check formatting without writing changes |

> `npm run dev` / `npm run build` also work if you prefer npm.

## Project structure

```
.
├── app/                 # App Router routes, layouts, API routes
│   ├── api/health/      # Example health-check route handler
│   ├── blog/            # Blog index + [slug] dynamic post pages
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles + Tailwind directives
├── components/          # Reusable UI components
├── content/blog/        # MDX blog posts (source of truth for the blog)
├── lib/                 # Framework-agnostic helpers (e.g. post loader)
├── public/              # Static assets served at the site root
├── tailwind.config.ts   # Tailwind theme / design tokens
└── next.config.mjs      # Next.js configuration
```

## Writing blog posts

Add an `.mdx` file to `content/blog/`. Frontmatter drives the listing and page
metadata:

```mdx
---
title: "My Post Title"
description: "A one-line summary shown on the blog index."
date: "2026-07-13"
---

Write standard **Markdown** / MDX here.
```

The post is automatically picked up by the blog index (`/blog`) and rendered at
`/blog/<filename>`. Posts are sorted by `date` (newest first). See
`lib/posts.ts` for the loader.

## Building for production

```bash
pnpm build   # produces an optimized build in .next/
pnpm start   # serves it
```

The build runs type-checking and linting, so a green `pnpm build` is
CI-friendly and safe to gate merges on.
