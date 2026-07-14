# ChatPulse Landing — Section Design Specs

**Owner:** Designer · **Status:** v1 (CHA-9) · **Date:** 2026-07-13
**Depends on:** Design system [`docs/design-system.md`](./design-system.md) (CHA-6) · Copy [`docs/messaging-framework.md`](./messaging-framework.md) (CHA-7)

Annotated, build-ready specs for the four landing-page sections — **hero, features,
CTA, footer** — plus the shared **top nav**. Every value is a token from the design
system, so the Founding Engineer implements by direct class lookup. Each section is
specced for **desktop (`md`+, ≥768px)** and **mobile (`< md`)**, with responsive
behavior and interaction states called out inline.

> **Copy source:** All headline / benefit / CTA text below is drawn from CHA-7. Where a
> choice exists (e.g. hero headline A–D), the CHA-7 "recommended default" is used and
> marked. **Positioning note:** CHA-7 (team chat) supersedes the older analytics framing
> in `product-brief.md` for all site copy — flagged for CEO in CHA-7 §9, non-blocking here.

---

## 0. Global conventions (apply to every section)

| Concern            | Spec                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Section wrapper    | `<section class="py-section-sm md:py-section">` (64px mobile → 96px desktop vertical rhythm)   |
| Inner container    | `<div class="mx-auto max-w-container px-6 md:px-8">` (1152px max, 24→32px gutters)             |
| Full-bleed sections| Hero/feature grids may use `max-w-wide` (1280px); body copy blocks stay `max-w-content` (768px)|
| Heading pattern    | Eyebrow `text-caption font-semibold uppercase tracking-wide text-brand-600` → H2 → lead copy   |
| Section title      | `text-h3 sm:text-h2 text-ink-900` (28px mobile → 40px desktop)                                 |
| Body copy          | `text-body text-ink-600`; lead/subcopy `text-body-lg text-ink-600`                            |
| Alt-section bg     | Alternate white ↔ `bg-ink-50` between sections for rhythm (see per-section notes)             |
| Motion             | Entrance reveals `motion-safe:` only, `ease-out-expo`, 200ms; never block content on JS        |
| Dark mode          | Reference surface roles (§12 of design system); class-based `.dark`. Per-section dark notes below |
| Breakpoints        | Tailwind defaults — mobile-first base, reflow to multi-column at `md` (768px)                  |

**Section order (top → bottom):** Nav → Hero → Features → CTA → Footer.
**Background rhythm:** Nav (translucent) · Hero (white) · Features (`bg-ink-50`) · CTA (brand gradient) · Footer (`bg-ink-50`).

---

## 1. Top navigation (shared, sticky)

Implements design-system §11. Present on every page; specced here because it frames the hero.

**Desktop (`md`+)**

```
┌──────────────────────────────────────────────────────────────────────┐
│  ChatPulse            Features   Security   Blog        [Join waitlist]│  h-16, sticky
└──────────────────────────────────────────────────────────────────────┘
```

- Bar: `sticky top-0 z-40 h-16 border-b border-ink-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70`
- Inner: `mx-auto max-w-container px-6 md:px-8 flex h-full items-center justify-between`
- Logo (left): `text-ink-900 font-semibold text-body-lg` — wordmark "ChatPulse", links to `/`
- Links (center/right group `hidden md:flex items-center gap-1`): each is a ghost button
  `px-3 h-9 text-small font-medium text-ink-600 hover:text-ink-900 hover:bg-ink-100 rounded transition-colors`
  — targets: `#features`, `#security` (anchor), `/blog`. Active route → `text-ink-900`.
- Primary CTA (right): "Join waitlist" — primary button md (`h-10 px-4 bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 rounded font-semibold text-small shadow-xs`), anchors to `#waitlist` (the CTA section).

**Mobile (`< md`)**

- Links collapse to a hamburger icon button on the right: `md:hidden h-10 w-10 rounded-md` with `aria-label="Open menu"`, `aria-expanded`, `aria-controls="mobile-nav"`.
- Opens a full-width sheet below the bar: `bg-white border-b border-ink-200`, links stacked at `h-12` tap targets (`flex flex-col`), each `text-body text-ink-800 px-6`. CTA "Join waitlist" full-width primary (`w-full`) pinned at the bottom of the sheet with `p-6`.
- Close on route change, `Esc`, backdrop tap, or link tap. Trap focus while open; restore focus to the toggle on close.

**States:** links — default/hover/active per above; focus-visible ring on every interactive element (`focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2`). Sticky bar gains no shadow (border only) to stay flat/Linear-like.

**Dark:** bar `bg-ink-950/80`, `border-ink-800`; links `text-ink-400 hover:text-ink-100`; CTA keeps brand-600 fill (white label 6.3:1 AA).

---

## 2. Hero section

The primary conversion surface. Left-aligned copy + inline waitlist form on desktop;
stacked and centered on mobile. Right column holds a product-visual placeholder.

**Copy (CHA-7 §7 recommended default):**
- Eyebrow: `Now in private beta` (optional badge — see states)
- Headline (H1): **"Team chat that's fast, searchable, and private."**
- Subhead: "ChatPulse gives dev teams real-time messaging, threads, and full-text search — with end-to-end encryption on by default. Fast to set up, built to stay out of your way."
- Primary CTA: **"Join the waitlist"** · Secondary (ghost): "See how it works" → `#features`
- Microcopy under form: "Be first in when we launch. No spam, unsubscribe anytime."

### Desktop layout (`md`+)

```
┌──────────────────────────────── max-w-wide ─────────────────────────────────┐
│  ┌───────────────── 6/12 col ─────────────┐   ┌──── 6/12 col ─────────────┐  │
│  │ [ Now in private beta ]  ← badge        │   │                           │  │
│  │ Team chat that's fast,                   │   │   ┌─────────────────┐     │  │
│  │ searchable, and private.   ← text-h1     │   │   │  product visual  │     │  │
│  │                                          │   │   │  placeholder     │     │  │
│  │ ChatPulse gives dev teams… ← body-lg     │   │   │  (app UI / mock) │     │  │
│  │                                          │   │   │  rounded-2xl     │     │  │
│  │ [ you@team.com    ][ Join the waitlist ] │   │   │  shadow-overlay  │     │  │
│  │ Be first in when we launch…  ← microcopy │   │   └─────────────────┘     │  │
│  └──────────────────────────────────────────┘   └───────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Section: `relative py-section-sm md:py-section bg-white overflow-hidden`. Optional decorative background: a soft indigo→teal radial glow top-right, `motion-safe` and `aria-hidden`, using `brand-500/pulse-500` at low opacity — never behind text at a contrast-breaking level.
- Container: `mx-auto max-w-wide px-6 md:px-8`
- Grid: `grid md:grid-cols-2 gap-12 lg:gap-16 items-center`
- **Left column (copy):**
  - Eyebrow badge: `inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-200 px-3 py-1 text-caption font-semibold uppercase tracking-wide text-brand-700` + a small `pulse-500` dot.
  - H1: `mt-5 text-h2 md:text-h1 text-ink-900 max-w-[14ch]` (steps 40px → 56px; ~14-char measure keeps the 6-word headline to 2 tidy lines).
  - Subhead: `mt-5 text-body-lg text-ink-600 max-w-content` (option-1 subhead is ~2 lines at this measure).
  - Waitlist form (inline): `mt-8 flex flex-col sm:flex-row gap-2 max-w-md` — email field (input base, §10, `flex-1`) + primary button lg (`h-12 px-6 shrink-0`). Label `sr-only` "Work email".
  - Microcopy: `mt-3 text-small text-ink-500`.
  - Secondary CTA "See how it works": ghost button, `mt-6` or beside primary on wide viewports — low emphasis, `text-ink-700`.
- **Right column (visual):** `rounded-2xl border border-ink-200 bg-ink-50 shadow-overlay aspect-[4/3]` placeholder for a product screenshot/mock. `motion-safe:animate` a subtle float optional. Marked `aria-hidden` if purely decorative; real screenshot gets descriptive `alt`.

### Mobile layout (`< md`)

```
┌──────────────── max-w-content ────────────────┐
│           [ Now in private beta ]   ← centered │
│      Team chat that's fast,                     │
│      searchable, and private.  ← text-h2        │
│      ChatPulse gives dev teams…  ← body-lg      │
│      ┌───────────────────────────────────────┐ │
│      │  you@team.com                          │ │  full-width stacked
│      ├───────────────────────────────────────┤ │
│      │           Join the waitlist            │ │  full-width primary
│      └───────────────────────────────────────┘ │
│      Be first in when we launch…               │
│      ┌───────────────────────────────────────┐ │
│      │        product visual placeholder      │ │  visual moves BELOW copy
│      └───────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

- Single column, `text-center` (`md:text-left`). Grid collapses to one column; visual renders **after** copy (source order: copy first for a11y + LCP).
- Form stacks vertically (`flex-col`): field full-width, button full-width below (`w-full`).
- H1 uses `text-h2` (40px) to avoid overflow on 320px; line length naturally short.
- Visual: reduce to `aspect-[4/3]` full-width card, `mt-10`; may be hidden `< sm` if it hurts LCP (`hidden sm:block`) — decision left to engineer based on real asset weight.

### States & a11y

| Element        | State                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Email field    | default / focus (`focus:border-brand-600 focus:ring-2 focus:ring-brand-600/30`) / error (`border-danger` + `aria-invalid` + `text-danger` help) / disabled |
| Submit button  | default / hover (`brand-700`) / active (`brand-800`) / loading (spinner + `aria-busy`, label "Joining…", disabled) / disabled `opacity-50` |
| Form success   | Replace form with `bg-success-soft text-success-fg rounded-md px-4 py-3 text-small` — "You're on the list. We'll be in touch." |
| Keyboard       | Logical tab order: field → submit → secondary CTA. Enter submits. Visible focus rings throughout. |
| Reduced motion | All entrance/float animation gated behind `motion-safe:`; static layout is fully functional.    |

**Dark:** section `bg-bg` (ink-950); H1 `text-ink-100`; subhead `text-ink-400`; badge `bg-brand-950/40 border-brand-800 text-brand-300`; visual card `bg-ink-900 border-ink-800`.

---

## 3. Features section

Six benefits from CHA-7 §4, benefit-first, on cards. `id="features"` (nav anchor).
Optional two-part split: a "Security" callout can carry `id="security"` (see 3.4).

**Section intro copy (CHA-7 §8 lead-ins):**
- Eyebrow: `Why ChatPulse`
- Title (H2): "Everything your team needs to move fast — and stay private."
- Lead (optional): "Real-time messaging with the structure, search, and encryption engineering teams actually need."

**The six feature cards (benefit → feature → proof, from CHA-7 §4):**

| Icon (suggested)   | Card title (benefit)                 | Body (feature + proof)                                                        |
| ------------------ | ------------------------------------ | ----------------------------------------------------------------------------- |
| ⚡ bolt            | Move at the speed of the conversation | Real-time messaging. Sub-second delivery — no refresh, no lag.                |
| 🔒 lock            | Private by default, not by upgrade    | End-to-end encryption on from message one — even we can't read your messages. |
| 🧵 threads         | Keep the signal, lose the noise       | Threads for the deep dive, channels for the big picture.                      |
| 📎 paperclip       | Share the work, not just the link     | Drag in designs, logs, and docs — files stay with the context.                |
| 🔍 search          | Find any decision in seconds          | Full-text search across every message, thread, and file. Instantly.          |
| 🔌 plug            | Wire ChatPulse into your stack        | Bring deploys, alerts, and tickets into the channels where you already work.  |

> Icons are placeholders (suggest Lucide: `Zap, Lock, MessagesSquare, Paperclip, Search, Plug`). Keep integration copy generic per CHA-7 §4 claims-discipline note.

### Desktop layout (`md`+)

```
┌──────────────────────────── max-w-container ─────────────────────────────┐
│                    Why ChatPulse   ← eyebrow, centered                     │
│         Everything your team needs to move fast — and stay private.       │
│              Real-time messaging with the structure…  ← lead              │
│                                                                            │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐                              │
│   │ ⚡        │   │ 🔒        │   │ 🧵        │   ← 3-col grid @ lg          │
│   │ Move at   │   │ Private   │   │ Keep the  │                            │
│   │ the speed │   │ by default│   │ signal…   │                            │
│   └──────────┘   └──────────┘   └──────────┘                              │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐                              │
│   │ 📎        │   │ 🔍        │   │ 🔌        │                            │
│   └──────────┘   └──────────┘   └──────────┘                              │
└────────────────────────────────────────────────────────────────────────────┘
```

- Section: `py-section-sm md:py-section bg-ink-50` (alt background vs. white hero).
- Container: `mx-auto max-w-container px-6 md:px-8`.
- Intro block: centered, `max-w-content mx-auto text-center`. Eyebrow → H2 (`text-h3 sm:text-h2`) → lead (`mt-4 text-body-lg text-ink-600`).
- Grid: `mt-12 md:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3` (1 → 2 → 3 columns).
- **Card** (design-system §7): `rounded-lg border border-ink-200 bg-white p-6 shadow-card`.
  - Icon chip: `inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600` (icon `h-5 w-5`). Vary accent per pillar allowed: security card may use `bg-pulse-50 text-pulse-700`.
  - Title: `mt-4 text-h4 text-ink-900`.
  - Body: `mt-2 text-body text-ink-600`.
  - These cards are **non-interactive** (no link) → no hover-lift; keep resting `shadow-card` only. (If a card later links to a doc, add §7 interactive-card treatment.)

### Mobile layout (`< md`)

- Single column (`grid-cols-1`), cards full-width, `gap-6`. Intro stays centered.
- Cards keep `p-6`; icon-title-body stack unchanged. Order follows the table (most important benefits — speed, privacy — first).
- H2 at `text-h3` (28px). No horizontal scroll; everything reflows vertically.

### 3.4 Security callout (optional sub-band, `id="security"`)

A single emphasized row reinforcing pillar 2 (privacy), giving the nav "Security" link a target.

- Full-width band inside the section or its own: `rounded-2xl bg-ink-900 text-ink-100 p-8 md:p-12` (inverted surface for emphasis), or a `bg-gradient-to-br from-brand-600 to-pulse-600` panel.
- Content: H3 "Private by default." + one line "End-to-end encryption on from message one — not a compliance upsell." + ghost/secondary CTA "How encryption works" → blog.
- Desktop: two-column (copy left, key-points list right). Mobile: stacked, `text-center` optional.

### States & a11y

- Cards are static content — no interactive states unless linked. Icons `aria-hidden`; the title carries meaning.
- Grid uses semantic `<ul>/<li>` or `<article>` per card; H2 → H4 heading order preserved (no skipped levels).
- Reduced motion: optional stagger-in on scroll is `motion-safe:` only.

**Dark:** section `bg-bg-subtle` (`#0b1120`); cards `bg-surface` (ink-900) `border-ink-800`; icon chip `bg-brand-950/40 text-brand-300`; title `text-ink-100`, body `text-ink-400`.

---

## 4. CTA section (waitlist conversion)

Full-width brand-gradient band, high emphasis. `id="waitlist"` (nav + hero CTA target).
Second, focused ask after the visitor has read the value props.

**Copy (CHA-7 §7 / §8):**
- Title (H2): "Be first in when ChatPulse launches."
- Sub: "Join the waitlist — real-time, searchable, end-to-end-encrypted team chat, built for how engineering teams work."
- Primary CTA: **"Join the waitlist"** · Microcopy: "No spam, unsubscribe anytime."

### Desktop layout (`md`+)

```
┌──────────────────────── brand gradient band ────────────────────────────┐
│                                                                          │
│              Be first in when ChatPulse launches.   ← text-h2, white     │
│              Join the waitlist — real-time, searchable…  ← body-lg       │
│                                                                          │
│              [ you@team.com          ][  Join the waitlist  ]            │
│              No spam, unsubscribe anytime.                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

- Section: `py-section-sm md:py-section`. Inner panel is the gradient card so the band has breathing room, or full-bleed — pick one:
  - **Panel (recommended):** `mx-auto max-w-wide px-6 md:px-8` → `rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-pulse-600 px-6 py-14 md:px-16 md:py-20 text-center shadow-overlay`.
- Content wrapper: `mx-auto max-w-content`.
- Title: `text-h3 sm:text-h2 text-white`.
- Sub: `mt-4 text-body-lg text-brand-100` (light-on-gradient; verify ≥4.5:1 — `brand-100 #e0e7ff` on `brand-600` passes for large text; use `text-white/90` if body-size).
- Form: `mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto`. On the gradient, the field is white (`bg-white`) and the button is an **inverted** primary — white fill, brand text — so it stands out on the colored band: `bg-white text-brand-700 hover:bg-brand-50 active:bg-brand-100 shadow-xs`. Field keeps input base but `focus:ring-white/60`.
- Microcopy: `mt-3 text-small text-brand-100`.

### Mobile layout (`< md`)

- Panel `px-6 py-12`, `rounded-2xl` (or `rounded-none`/full-bleed to edges if cleaner on small screens). Title `text-h3` (28px). Content `text-center`.
- Form stacks (`flex-col`): white field full-width, inverted button full-width below.
- Ensure tap targets ≥44px (button lg `h-12`).

### States & a11y

- Same form states as hero (§2): focus / error / loading / success. Success message on gradient uses a white card: `bg-white/95 text-success-fg rounded-md px-4 py-3` so the confirmation stays legible on the colored band.
- Contrast: white text on `brand-600` = 6.4:1 (AA). Gradient's teal end (`pulse-600 #0891b2`) with white = 4.6:1 — still AA for large text; keep body sub at `text-white/90` or larger to stay safe across the whole gradient.
- One primary action only. Focus ring on the inverted button uses `focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600`.
- Reduced motion: no animated gradient; static fill.

**Dark:** gradient band is already dark-safe; optionally deepen to `from-brand-700 to-pulse-700`. Field `bg-ink-900 text-ink-100 border-ink-700`; keep the white/inverted button.

---

## 5. Footer

Implements design-system §11 footer. Site-wide navigation, legal, and boilerplate.

**Copy:**
- Boilerplate (CHA-7 §8, ≤50 words): "ChatPulse is real-time team chat for engineering teams, startups, and remote-first companies. Channels, threads, file sharing, and instant full-text search — all with end-to-end encryption on by default."
- Columns (suggested): **Product** (Features, Security, Blog) · **Company** (About, Careers) · **Legal** (Privacy, Terms).
- Bottom row: "© 2026 ChatPulse" + social/legal links.

### Desktop layout (`md`+)

```
┌──────────────────────────── max-w-container ─────────────────────────────┐
│  ChatPulse                    PRODUCT      COMPANY      LEGAL              │
│  Real-time team chat for      Features     About        Privacy           │
│  engineering teams…           Security     Careers      Terms             │
│  (boilerplate, max-w-xs)      Blog                                         │
│  ────────────────────────────────────────────────────────────────────    │
│  © 2026 ChatPulse                                    [GitHub] [X] [in]     │
└────────────────────────────────────────────────────────────────────────────┘
```

- Footer: `border-t border-ink-200 bg-ink-50`.
- Container: `mx-auto max-w-container px-6 md:px-8 py-12`.
- Top grid: `grid gap-8 md:grid-cols-[1.5fr_repeat(3,1fr)]` — brand/boilerplate block (left, wider) + three link columns.
  - Brand block: wordmark `text-ink-900 font-semibold`, boilerplate `mt-3 text-small text-ink-500 max-w-xs`.
  - Column header: `text-caption font-semibold uppercase tracking-wide text-ink-400`.
  - Column links: `mt-3 space-y-2`, each `text-small text-ink-500 hover:text-ink-800 transition-colors`.
- Divider + bottom row: `mt-12 pt-8 border-t border-ink-200 flex flex-col sm:flex-row items-center justify-between gap-4`.
  - Copyright: `text-small text-ink-500`.
  - Social icons: `flex gap-4`, each `h-9 w-9 rounded-md text-ink-400 hover:text-ink-800 hover:bg-ink-100 inline-flex items-center justify-center` with `aria-label`.

### Mobile layout (`< md`)

- Columns stack to single column (`grid-cols-1`), `gap-8`. Brand/boilerplate first, then the three link groups stacked (headers + links).
- Bottom row stacks (`flex-col`), centered: copyright above, social icons below (`gap-4`).
- Link tap targets: give footer links comfortable `py-1` so stacked lists are tappable.

### States & a11y

- Links: default `text-ink-500` → hover `text-ink-800`; focus-visible ring on all. Social icons carry `aria-label` (icon-only).
- Use a `<footer>` landmark; link groups as `<nav aria-label="Footer">` with `<ul>`. Column headers are real headings or `<h2 class="sr-only">`-style labels associated with each list.
- Sufficient contrast: `ink-500` on `ink-50` ≈ 4.6:1 (AA for the small link text); hover deepens to `ink-800`.

**Dark:** footer `bg-bg-subtle border-ink-800`; headers `text-ink-500`; links `text-ink-400 hover:text-ink-100`; divider `border-ink-800`.

---

## 6. Responsive & state summary (acceptance-criteria map)

**AC: each section specced desktop + mobile — covered:**

| Section   | Desktop (`md`+)                                  | Mobile (`< md`)                                | States specced                                  |
| --------- | ------------------------------------------------ | ---------------------------------------------- | ----------------------------------------------- |
| Nav §1    | horizontal links + CTA, sticky h-16              | hamburger → full-width sheet, stacked h-12     | link hover/active/focus, menu open/close        |
| Hero §2   | 2-col (copy + visual), inline form               | 1-col centered, stacked form, visual below     | field focus/error, button hover/active/loading/disabled, form success, reduced-motion |
| Features §3 | 3-col card grid (`lg`), 2-col (`sm`)           | 1-col stacked cards                            | static cards (+ optional interactive/link variant), scroll-reveal motion-safe |
| CTA §4    | gradient panel, inline form, centered            | gradient panel, stacked full-width form        | field/button states, inverted focus ring, success on-gradient |
| Footer §5 | brand block + 3 link columns, bottom row split   | single-column stacked, centered bottom row     | link hover/focus, icon aria-labels              |

**Cross-cutting states covered:** hover · active/pressed · focus-visible (keyboard) · disabled · loading · error · success · empty (form default) · reduced-motion · dark mode (per-section role mapping).

**Breakpoint behavior:** all layouts are mobile-first and reflow to multi-column at `md` (768px); the feature grid adds its third column at `lg` (1024px). No layout depends on `xl`/`2xl` beyond max-width capping (`max-w-container` / `max-w-wide`).

---

## 7. Handoff checklist (for the Founding Engineer)

- [ ] Build order: Nav → Hero → Features → CTA → Footer as sibling components under `app/page.tsx`, each a `components/landing/*` file.
- [ ] Prerequisite design-system wiring (CHA-6 §13): enable `darkMode: "class"`, swap the `globals.css` role variables, wire `next/font`. These block correct rendering of the specs above.
- [ ] Use tokens only — no ad-hoc hex/px. Every class above resolves to `tailwind.config.ts`.
- [ ] Waitlist form needs a real submit endpoint (separate ticket); spec assumes async submit with loading + success + error states.
- [ ] Replace the current placeholder `app/page.tsx` (scaffold) with the composed sections.
- [ ] Verify AA contrast on the CTA gradient with the final chosen stops; keep body copy ≥ large-text size on colored bands.
- [ ] Provide/confirm the hero product visual asset (screenshot vs. abstract mock) — placeholder spec'd as `aspect-[4/3]` `rounded-2xl` card.

**Open design decisions (non-blocking):** (1) hero eyebrow badge copy ("Now in private beta") pending CEO confirmation of launch stage; (2) whether the Security callout (§3.4) is its own section or a band inside Features; (3) final hero headline (A used per CHA-7 recommendation). None block first implementation.
