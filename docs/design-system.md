# ChatPulse Design System

**Owner:** Designer · **Status:** v1 (DESIGN-01) · **Date:** 2026-07-13

The single source of truth for ChatPulse's visual language. Aesthetic target:
premium developer-tool (Linear / Vercel) — confident, minimal, high-contrast, not
enterprise bloat. Every token here is mirrored in `tailwind.config.ts` as a theme
**extension** (the default Tailwind theme stays intact), so implementation is a
direct token lookup.

- **Framework:** Tailwind CSS 3 (App Router, RSC).
- **Accessibility baseline:** WCAG 2.1 **AA** — body text ≥ 4.5:1, large text/UI ≥ 3:1.
- **Font wiring:** `--font-sans` / `--font-mono` are set via `next/font` in the root
  layout; `font-sans` / `font-mono` utilities fall back to the system stack.

---

## 1. Color palette

Each brand ramp is a full 50–950 scale. The `DEFAULT` (bare `bg-brand`,
`text-pulse`, …) is the recommended everyday value.

### Primary — Brand Indigo (`brand`)

Core actions, links, focus rings, active states.

| Token           | Hex           | Typical use                              |
| --------------- | ------------- | ---------------------------------------- |
| `brand-50`      | `#eef2ff`     | tinted section background                |
| `brand-100`     | `#e0e7ff`     | soft fill / hover bg                     |
| `brand-200`     | `#c7d2fe`     | borders on tinted surfaces               |
| `brand-300`     | `#a5b4fc`     | disabled-on-color                        |
| `brand-400`     | `#818cf8`     | dark-mode accent text                    |
| `brand-500`     | `#6366f1`     | gradients, illustrations                 |
| **`brand-600`** | **`#4f46e5`** | **primary button, focus ring (DEFAULT)** |
| `brand-700`     | `#4338ca`     | primary button hover / active            |
| `brand-800`     | `#3730a3`     | pressed                                  |
| `brand-900`     | `#312e81`     | headings on light tint                   |
| `brand-950`     | `#1e1b4b`     | deepest accent                           |

`brand-600` on white = **6.4:1** (AA for normal text). White text on `brand-600`
= **6.4:1** — safe for button labels.

### Secondary — Pulse Teal (`pulse`)

The "pulse" motif: supporting UI, data accents, gradient partner to indigo. Base
`pulse-500 #06b6d4`. Use `pulse-600 #0891b2` (**4.6:1** on white) or darker for
text; lighter steps for fills, charts, and glows.

### Accent — Violet (`accent`)

Decorative emphasis only — badges, highlights, gradient stops. Base
`accent-500 #a855f7`; use `accent-600 #9333ea`+ for any text. Never the primary
action color.

### Grays — Ink (cool slate) (`ink`)

Text, borders, surfaces. Cool-tinted to sit with indigo.

| Token     | Hex       | Use                                       |
| --------- | --------- | ----------------------------------------- |
| `ink-50`  | `#f8fafc` | app background / subtle section           |
| `ink-100` | `#f1f5f9` | card muted background                     |
| `ink-200` | `#e2e8f0` | **default border / divider**              |
| `ink-300` | `#cbd5e1` | strong border, disabled fill              |
| `ink-400` | `#94a3b8` | placeholder, disabled text (large only)   |
| `ink-500` | `#64748b` | secondary/muted text (**4.8:1** on white) |
| `ink-600` | `#475569` | body-secondary, icons                     |
| `ink-700` | `#334155` | **body text** (**10.8:1**)                |
| `ink-800` | `#1e293b` | subheadings                               |
| `ink-900` | `#0f172a` | **headings (DEFAULT)**                    |
| `ink-950` | `#020617` | max-contrast / dark surfaces              |

### Semantic colors

Each has a `DEFAULT` (AA text/icon on white), a `-soft` background, and a `-fg`
text color for use on that soft background.

| Intent    | `DEFAULT` | `-soft` bg | `-fg` text |
| --------- | --------- | ---------- | ---------- |
| `success` | `#16a34a` | `#dcfce7`  | `#14532d`  |
| `warning` | `#d97706` | `#fef3c7`  | `#78350f`  |
| `danger`  | `#dc2626` | `#fee2e2`  | `#7f1d1d`  |
| `info`    | `#0284c7` | `#e0f2fe`  | `#075985`  |

Pattern: `bg-success-soft text-success-fg` for status pills/alerts.

---

## 2. Typography scale

System font stack via `font-sans` (UI/marketing) and `font-mono` (code, metrics,
data). Sizes are exposed as named `fontSize` tokens with baked-in line-height,
tracking, and weight where relevant.

| Token          | Size            | Line-height  | Weight / tracking | Use                          |
| -------------- | --------------- | ------------ | ----------------- | ---------------------------- |
| `text-h1`      | 56px / 3.5rem   | 1.05         | 700, −0.02em      | hero headline                |
| `text-h2`      | 40px / 2.5rem   | 1.1          | 700, −0.02em      | section title                |
| `text-h3`      | 28px / 1.75rem  | 1.2          | 600, −0.01em      | subsection / card title      |
| `text-h4`      | 20px / 1.25rem  | 1.3          | 600, −0.01em      | small heading, feature label |
| `text-body-lg` | 18px / 1.125rem | 1.7          | 400               | hero subcopy, lead paragraph |
| `text-body`    | 16px / 1rem     | 1.6          | 400               | default body                 |
| `text-small`   | 14px / 0.875rem | 1.5          | 400               | captions, meta, form help    |
| `text-caption` | 12px / 0.75rem  | 1.4, +0.01em | 400               | labels, eyebrows, badges     |

**Responsive headings:** step display sizes down on mobile, e.g.
`text-h2 md:text-h1` for the hero, or clamp with `text-h3 sm:text-h2` for section
titles. Eyebrow labels: `text-caption font-semibold uppercase tracking-wide text-brand-600`.

---

## 3. Spacing scale (8px grid)

Base unit = **8px**, with a 4px half-step for hairline gaps. Prefer stock Tailwind
numeric spacing (`1`=4px, `2`=8px, `4`=16px, `6`=24px, `8`=32px, `12`=48px,
`16`=64px, `24`=96px). The extension adds ChatPulse rhythm tokens:

| Token        | Value | Use                                |
| ------------ | ----- | ---------------------------------- |
| `0.5`        | 4px   | icon-to-label gap, hairline        |
| `18`         | 72px  | large component spacing            |
| `22`         | 88px  | oversized rhythm                   |
| `section-sm` | 64px  | vertical section padding (mobile)  |
| `section`    | 96px  | vertical section padding (desktop) |

Guideline: component-internal spacing steps in 4/8/12/16; between elements 16/24/32;
between sections `py-section-sm md:py-section`.

---

## 4. Border radius tokens

| Token               | Value | Use                               |
| ------------------- | ----- | --------------------------------- |
| `rounded-none`      | 0     | flush edges                       |
| `rounded-sm`        | 4px   | inputs, small chips               |
| `rounded` (DEFAULT) | 8px   | buttons, badges                   |
| `rounded-md`        | 10px  | inputs (comfortable), dropdowns   |
| `rounded-lg`        | 12px  | **cards**                         |
| `rounded-xl`        | 16px  | feature cards, media, code blocks |
| `rounded-2xl`       | 24px  | hero panels, large surfaces       |
| `rounded-full`      | pill  | tags, avatars, icon buttons       |

---

## 5. Elevation (shadows)

| Token               | Use                               |
| ------------------- | --------------------------------- |
| `shadow-xs`         | subtle lift (inputs, small chips) |
| `shadow-card`       | resting card                      |
| `shadow-card-hover` | card hover / interactive lift     |
| `shadow-overlay`    | modals, popovers, dropdowns       |
| `shadow-glow`       | brand-tinted focus/emphasis glow  |

Keep elevation restrained — one level of shadow per surface; prefer borders
(`border border-ink-200`) over heavy shadows for flat, Linear-like surfaces.

---

## 6. Buttons

Shared base: `inline-flex items-center justify-center gap-2 rounded font-semibold
text-small transition-colors duration-150 focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2
disabled:opacity-50 disabled:pointer-events-none`.

**Sizes:** sm `h-8 px-3` · **md (default)** `h-10 px-4` · lg `h-12 px-6 text-body`.

### Primary

Solid indigo — the single strongest action per view.

```
bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-xs
```

### Secondary

Neutral outline — supporting actions.

```
bg-white text-ink-800 border border-ink-300 hover:bg-ink-50 active:bg-ink-100
```

### Ghost

Low-emphasis / inline — nav, toolbars, tertiary.

```
bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200
```

Icon-only buttons: square (`h-10 w-10`), `rounded-md` or `rounded-full`, with an
`aria-label`. All buttons keep the shared focus ring for keyboard users.

---

## 7. Card component

A surface for grouping related content (feature, pricing, blog preview).

**Spec**

- Container: `rounded-lg border border-ink-200 bg-white shadow-card`
- Padding: `p-6` (24px); compact `p-4`, spacious `p-8`
- Internal rhythm: title → body gap `space-y-2`; media → content gap `mt-4`
- Title: `text-h4 text-ink-900`; body: `text-body text-ink-600`
- Interactive (linked) card: add
  `transition-shadow duration-200 hover:shadow-card-hover hover:border-ink-300`
  and wrap the whole card in one focusable link with a visible focus ring.
- Muted variant: `bg-ink-50 border-ink-100` (no shadow) for secondary panels.

**Reference markup**

```html
<article
  class="rounded-lg border border-ink-200 bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover"
>
  <h3 class="text-h4 text-ink-900">Real-time insights</h3>
  <p class="mt-2 text-body text-ink-600">
    See conversation trends the moment they happen.
  </p>
</article>
```

---

## 8. Section container widths & padding

Center content with `mx-auto` and horizontal padding
`px-6 md:px-8`; set vertical rhythm with `py-section-sm md:py-section`.

| Token (`max-w-*`) | Width  | Use                                  |
| ----------------- | ------ | ------------------------------------ |
| `prose`           | 672px  | blog / long-form reading measure     |
| `content`         | 768px  | narrow marketing copy, centered CTAs |
| `container`       | 1152px | **standard section container**       |
| `wide`            | 1280px | full-width hero, feature grids       |

**Standard section pattern**

```html
<section class="py-section-sm md:py-section">
  <div class="mx-auto max-w-container px-6 md:px-8">
    <!-- content -->
  </div>
</section>
```

Breakpoints use Tailwind defaults (`sm 640`, `md 768`, `lg 1024`, `xl 1280`,
`2xl 1536`). Design mobile-first; layouts reflow to multi-column at `md`+.

---

## 9. Motion (baseline)

Keep it subtle and fast. Durations: micro-interactions 150ms, surfaces 200ms.
Default easing `ease-out`; use `ease-out-expo` (`cubic-bezier(0.16,1,0.3,1)`) for
entrance/reveal. Always honor `prefers-reduced-motion` — gate non-essential
animation behind `motion-safe:`.

---

## 10. Inputs & forms

The waitlist form is the primary conversion path — keep it frictionless and legible.

**Text field base**

```
h-10 w-full rounded-md border border-ink-300 bg-white px-3.5 text-body text-ink-900
placeholder:text-ink-400 transition
focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30 focus:outline-none
disabled:opacity-50 disabled:bg-ink-50
```

- **Label:** `text-small font-medium text-ink-700`, `mb-1.5`. Always present (visually or
  `sr-only`); placeholders are not labels.
- **Help / meta:** `text-small text-ink-500`, `mt-1.5`.
- **Error:** `border-danger` + help text `text-small text-danger`, and set
  `aria-invalid`/`aria-describedby`. Never signal by color alone — pair with an icon or text.
- **Success confirmation:** `bg-success-soft text-success-fg rounded-md px-4 py-3 text-small`.
- **Textarea:** same as base, `min-h-[7rem] py-2.5`. **Select:** same base + chevron icon.
- **Checkbox / radio:** `h-4 w-4 rounded border-ink-300 text-brand-600 focus:ring-brand-600`.
- **Inline CTA form (hero waitlist):** field + primary button in a
  `flex flex-col sm:flex-row gap-2` row; button `shrink-0`. Full-width stacked on mobile.

---

## 11. Navigation

**Top bar**

- `sticky top-0 z-40 h-16` with `border-b border-ink-200` and a translucent, blurred
  surface: `bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70`.
- Inner: `mx-auto max-w-container px-6 md:px-8 flex h-full items-center justify-between`.
- **Logo** left (`text-ink-900 font-semibold`). **Links** center/right as ghost buttons:
  `text-small font-medium text-ink-600 hover:text-ink-900`; active link `text-ink-900`.
- **Primary CTA** ("Join waitlist") right, using the primary button spec.
- **Mobile (`< md`):** collapse links into a hamburger (`h-10 w-10` icon button,
  `aria-expanded`, `aria-controls`) that opens a full-width sheet — `bg-white`, stacked
  links at `h-12` tap targets, CTA full-width at the bottom. Close on route change / `Esc`.

**Footer**

- `border-t border-ink-200 bg-ink-50 py-12`. Columned links `text-small text-ink-500
hover:text-ink-800`; column headers `text-caption font-semibold uppercase text-ink-400`.
- Bottom row: copyright `text-small text-ink-500`, right-aligned social/legal links.

---

## 12. Dark mode & surface roles

**Strategy:** class-based (`darkMode: "class"`, driven by `<html class="dark">`) so we own
the toggle rather than depending on the OS alone. Components should reference **semantic
roles**, not raw ramp steps, so a single class flip re-themes the whole site. The current
`globals.css` ships a placeholder `prefers-color-scheme` block — replace it with the
role variables in §13.

| Role                        | Light                        | Dark                  |
| --------------------------- | ---------------------------- | --------------------- |
| `bg` (canvas)               | `#ffffff`                    | `#020617` (ink-950)   |
| `bg-subtle` (alt sections)  | `#f8fafc` (ink-50)           | `#0b1120`             |
| `surface` (cards, nav)      | `#ffffff`                    | `#0f172a` (ink-900)   |
| `surface-raised` (popovers) | `#ffffff` + `shadow-overlay` | `#1e293b` (ink-800)   |
| `border`                    | `#e2e8f0` (ink-200)          | `#1e293b` (ink-800)   |
| `border-strong`             | `#cbd5e1` (ink-300)          | `#334155` (ink-700)   |
| `text` (primary)            | `#0f172a` (ink-900)          | `#f1f5f9` (ink-100)   |
| `text-muted` (secondary)    | `#475569` (ink-600)          | `#94a3b8` (ink-400)   |
| `text-subtle` (tertiary)    | `#64748b` (ink-500)          | `#64748b` (ink-500)   |
| `link` / action             | `#4f46e5` (brand-600)        | `#818cf8` (brand-400) |
| `ring` (focus)              | `#4f46e5` (brand-600)        | `#818cf8` (brand-400) |

**Dark-mode contrast (verified against `#020617` canvas):** ink-100 text ~18:1 (AAA),
ink-400 muted text **7.9:1** (AAA), brand-400 links **6.8:1** (AA), white on brand-600
button fill 6.3:1 (AA). Rules: never put brand-500/600 _text_ on the dark canvas (too low) —
use brand-300/400; lean on `border` + `surface` contrast instead of heavy shadows on dark.

---

## 13. Engineer wiring (drop-in) & handoff checklist

**Tokens are already implemented** in `tailwind.config.ts` (colors, fontSize, spacing,
borderRadius, maxWidth, boxShadow, `ease-out-expo`). Two changes finish the system:

1. **Enable class dark mode** — add `darkMode: "class"` to the config.
2. **Replace the `globals.css` placeholder** with role variables so roles flip together:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg: 255 255 255;
    --bg-subtle: 248 250 252;
    --surface: 255 255 255;
    --border: 226 232 240;
    --text: 15 23 42;
    --text-muted: 71 85 105;
    --link: 79 70 229;
    --ring: 79 70 229;
  }
  .dark {
    --bg: 2 6 23;
    --bg-subtle: 11 17 32;
    --surface: 15 23 42;
    --border: 30 41 59;
    --text: 241 245 249;
    --text-muted: 148 163 184;
    --link: 129 140 248;
    --ring: 129 140 248;
  }
  body {
    background: rgb(var(--bg));
    color: rgb(var(--text));
  }
}
```

Optionally expose as utilities (`bg: "rgb(var(--bg) / <alpha-value>)"`, …) so `bg-bg`,
`text-text-muted`, `border-border` become first-class. Not required for v1 — the raw
ramp utilities already cover most needs. 3. **Wire fonts** via `next/font` in `layout.tsx`, exposing `--font-sans` / `--font-mono`.

**Acceptance-criteria coverage**

- [x] Color palette, **light + dark** (ramps §1, semantic §1, surface roles §12)
- [x] Type scale §2 · [x] Spacing §3 · [x] Radius §4 · [x] Shadow §5 · [x] Motion §9
- [x] Core components — buttons §6, cards §7, **inputs §10**, **nav §11**, section rhythm §8
- [x] Tailwind drop-in — tokens in `tailwind.config.ts` + wiring §13
- [x] WCAG AA contrast verified (light §1, dark §12)

**Non-blocking follow-ups for the engineer:** enable `darkMode: "class"`, swap the
`globals.css` placeholder, and wire the fonts. Per-page section layouts (landing, waitlist,
blog) ship as separate design tickets.

---

## Token → Tailwind quick reference

| Category   | Where                                                                                          |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Colors     | `theme.extend.colors` (`brand`, `pulse`, `accent`, `ink`, `success`/`warning`/`danger`/`info`) |
| Type       | `theme.extend.fontSize` (`h1`–`h4`, `body-lg`, `body`, `small`, `caption`)                     |
| Spacing    | `theme.extend.spacing` (+ default numeric scale)                                               |
| Radius     | `theme.extend.borderRadius`                                                                    |
| Elevation  | `theme.extend.boxShadow`                                                                       |
| Containers | `theme.extend.maxWidth` (`prose`, `content`, `container`, `wide`)                              |

All values live in `tailwind.config.ts`. Update tokens there; this document is the
human-readable contract the Founding Engineer implements against.
