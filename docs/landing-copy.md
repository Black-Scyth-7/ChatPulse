# ChatPulse — Landing Page Copy (all sections)

**Owner:** ContentWriter · **Date:** 2026-07-13 · **Status:** v1 (ready to drop into components) · **Ticket:** CHA-8
**Source of truth:** `docs/messaging-framework.md` (CHA-7). Voice, claims discipline, and CTA conventions all trace back to that brief. If this copy and CHA-7 disagree, CHA-7 wins.

> **Heads-up for the CEO / Founding Engineer — positioning conflict to resolve.**
> `docs/product-brief.md` describes ChatPulse as a **real-time analytics layer for chat products** (SDK, dashboards, message metrics). The CHA-7 messaging framework — which CHA-8 explicitly names as the input — describes ChatPulse as **secure real-time team chat for engineering teams**. These are two different products. The current scaffold (`app/page.tsx`, `app/layout.tsx`) uses the analytics line ("Real-time conversation insights").
> **This copy follows CHA-7 (team chat), per the CHA-8 instruction.** If the analytics positioning is the real product, this whole page needs a rewrite against `product-brief.md` instead. Flagging so someone reconciles the two docs before build. See "Open decisions" at the bottom.

This document contains finished, drop-in copy for every planned landing section, in DOM order, with the intended heading level (H1/H2/H3) called out for SEO. Sentence case throughout; serial commas; no exclamation marks; product name is **ChatPulse**.

---

## 0. Page metadata (SEO)

Drop into `app/layout.tsx` `metadata` (or a page-level `metadata` export for `/`).

| Field | Copy | Notes |
| --- | --- | --- |
| `title` | `ChatPulse — Secure real-time team chat` | 40 chars. Brand-first; primary keyword "real-time team chat." |
| `title` (template for subpages) | `%s — ChatPulse` | For blog/waitlist subpages. |
| `description` | `Secure, real-time team chat for engineering teams. Channels, threads, and instant search — with end-to-end encryption on by default.` | 152 chars (≤155). From CHA-7 §1 "Standard." |
| `og:title` | `Team chat that's fast, searchable, and encrypted end to end.` | CHA-7 §1 "Punchy." |
| `og:description` | `Real-time messaging, threads, channels, and full-text search — all end-to-end encrypted. Built for how engineering teams actually work.` | 133 chars. |
| `og:type` | `website` | |
| `twitter:card` | `summary_large_image` | |
| Keywords / intent (not a tag; for content strategy) | secure team chat, real-time team chat, end-to-end encrypted chat, developer team chat, searchable team messaging | Reflect in H1/H2s, not a meta keywords tag. |

**Heading outline (one H1, section H2s) for SEO:**
`H1` Team chat that's fast, searchable, and private → `H2` features intro → `H2` (per-feature H3s) → `H2` security → `H2` social proof → `H2` final CTA. Exactly one `H1` on the page.

---

## 1. Navigation bar

Ref: design-system §11. Logo left; links center/right (ghost); primary CTA right.

| Slot | Copy |
| --- | --- |
| Logo (wordmark) | `ChatPulse` |
| Nav link 1 | `Features` (anchor `#features`) |
| Nav link 2 | `Security` (anchor `#security`) |
| Nav link 3 | `Blog` (`/blog`) |
| Primary CTA (button) | `Join the waitlist` (anchor `#waitlist`) |
| Mobile menu button `aria-label` | `Open menu` / `Close menu` |

---

## 2. Hero

Ref: CHA-7 §7 (recommended default hero) + design-system §2 (`text-h1`), §10 (inline waitlist form).

- **Eyebrow** (`text-caption`, uppercase, `text-brand-600`): `Now building — join the waitlist`
- **H1** (`text-h1`): **Team chat that's fast, searchable, and private.**
- **Subhead** (`text-body-lg`, `max-w-content`): ChatPulse gives dev teams real-time messaging, threads, and full-text search — with end-to-end encryption on by default. Fast to set up, built to stay out of your way.
- **Primary CTA (button):** `Join the waitlist`
- **Secondary CTA (ghost/link):** `See how it works` (anchor `#features`)
- **CTA microcopy** (`text-small`, `text-ink-500`): Be first in when we launch. No spam, unsubscribe anytime.

**Inline hero waitlist form (if used instead of a plain button — design-system §10):**

| Slot | Copy |
| --- | --- |
| Email label (`sr-only` ok) | `Work email` |
| Email placeholder | `you@company.com` |
| Submit button | `Join the waitlist` |
| Helper text | `Be first in when we launch. No spam, unsubscribe anytime.` |
| Success message | `You're on the list. We'll email you the moment ChatPulse opens up.` |
| Error — empty/invalid | `Enter a valid email address.` |
| Error — already joined | `You're already on the list — check your inbox.` |
| Error — generic | `Something went wrong. Try again in a moment.` |

**Alt H1 options (all on-brand, CHA-7 §7 — swap without a rewrite):**
- B (audience-led): `Real-time chat built for engineering teams.`
- C (security-led): `Every message, encrypted end to end.`
- D (outcome-led): `Keep the signal. Lose the noise.`

---

## 3. Feature grid

Ref: CHA-7 §4 (benefits→features) + §8 (H2 lead-ins). Six cards; benefit-first title, feature named in body. Design-system §7 card spec.

- **Section eyebrow** (`text-caption`): `Features`
- **Section H2** (`text-h2`): **Everything a fast team needs — nothing it doesn't.**
- **Section intro** (`text-body-lg`, optional): Real-time messaging, structured threads, and search that actually reaches everything. Built for engineers, encrypted by default.

Grid anchor id: `#features`. Cards use `H3` titles for outline hierarchy.

| # | Card H3 (benefit) | Card body (feature named) | Micro-proof (optional caption) |
| --- | --- | --- | --- |
| 1 | Move at the speed of the conversation | Real-time messaging means messages land the instant they're sent — so standups, incidents, and quick decisions happen live, with no refresh and no lag. | Sub-second delivery. |
| 2 | Private by default, not by upgrade | Every message is end-to-end encrypted from message one. Sensitive work stays between the people in the room — encryption is the baseline, never a paid tier. | Encrypted end to end. |
| 3 | Keep the signal, lose the noise | Threads spin detailed discussion out of the main flow; channels keep teams, projects, and topics cleanly separated. Structure, not chaos. | Threads and channels. |
| 4 | Find any decision in seconds | Full-text search reaches every message, thread, and file. Answers are a query away instead of a scroll away. | Search everything, instantly. |
| 5 | Share the work, not just the link | Drag in designs, logs, and docs. Files live alongside the conversation that produced them, so context never gets lost. | Files where the work is. |
| 6 | Wire ChatPulse into your stack | Integrations bring deploys, alerts, and tickets into the channels where your team already works. | Your tools, where the work happens. |

> **Claims discipline (CHA-7 §4):** Card 6 stays generic — no named third-party connectors until they ship.

---

## 4. Social proof

Ref: CHA-7 §5 (audiences) + claims discipline (no invented metrics — CHA-7 §6.5). ChatPulse is pre-launch, so **no fake logos, counts, or testimonials.** Use honest, pre-launch social proof: who it's built for and the founding-user angle.

- **Section eyebrow** (`text-caption`): `Who it's for`
- **Section H2** (`text-h2`): **Built for teams that live in chat.**
- **Section intro** (`text-body-lg`): ChatPulse is for teams where chat is where the work actually happens — fast, technical, and distributed.

**Three audience cards** (design-system card, `H3` titles):

| Audience H3 | Body |
| --- | --- |
| Dev teams | Chat that respects how engineers work — keyboard-fast, low-noise, and searchable. Real-time for incidents, threads for the deep dives. |
| Startups | Enterprise-grade privacy without the enterprise setup. Get running in minutes with security you don't have to configure. |
| Remote-first companies | When chat is your office, it should be private and findable. Threads, channels, and search keep a distributed team in sync across time zones. |

**Founding-user callout (honest pre-launch proof, in place of testimonials):**
- Line: **Join the founding teams shaping ChatPulse.** Early users get direct input on the roadmap and first access at launch.
- CTA: `Get early access` (anchor `#waitlist`)

> **Do not add** (until real): customer logos, user counts, star ratings, or quotes. Swap this section for real testimonials post-launch. Placeholder-quote scaffolding is fine for the Designer as long as it's visibly marked and never shipped as fact.

---

## 5. Security section

Ref: CHA-7 §3 (pillar 2), §4 (benefit 2). This is a differentiator — give it its own section. Anchor `#security`.

- **Section eyebrow** (`text-caption`): `Security`
- **Section H2** (`text-h2`): **Private by default — even we can't read your messages.**
- **Lead paragraph** (`text-body-lg`, `max-w-content`): End-to-end encryption is on from message one, not buried behind a compliance tier. Your conversations, files, and search index stay yours — encrypted in transit and at rest, decrypted only on the devices in the conversation.

**Security proof points (3 short items, `H4` labels + one line each):**

| H4 label | Body |
| --- | --- |
| Encrypted end to end | Messages and files are encrypted on your devices and stay that way in transit and at rest. Only the people in the conversation hold the keys. |
| On by default, not by upgrade | No plan to pick, no toggle to find. Encryption is the baseline for every message, in every channel, from day one. |
| Your data stays yours | Your conversations and search index belong to your team — not to an ad model and not to us. |

- **Section CTA (ghost/link):** `Join the waitlist` (anchor `#waitlist`)

> **Claims discipline:** Copy above states only what CHA-7 asserts (E2E on by default; encrypted in transit and at rest). Do **not** add specific certifications (SOC 2, HIPAA, GDPR DPA), key-management specifics, or audit claims until Engineering/Legal confirm them. If unverified, cut the line rather than soften it.

---

## 6. Final CTA / waitlist

Ref: CHA-7 §7 (CTA conventions). Primary conversion band. Anchor `#waitlist`.

- **Eyebrow** (`text-caption`): `Get early access`
- **H2** (`text-h2`): **Be first in when ChatPulse launches.**
- **Subhead** (`text-body-lg`): Fast, searchable, end-to-end-encrypted team chat — built for dev teams, startups, and remote-first companies. Join the waitlist and we'll email you the moment it opens up.
- **Waitlist form** (reuse the strings from §2's inline form table — same labels, placeholder, success, and error copy).
- **Primary CTA button:** `Join the waitlist`
- **Microcopy** (`text-small`, `text-ink-500`): No spam, unsubscribe anytime. We'll only email you about ChatPulse.

---

## 7. Footer

Ref: design-system §11 (footer). Columned links + boilerplate + bottom row.

- **Footer boilerplate** (`text-small`, `text-ink-500`, from CHA-7 §8): ChatPulse is real-time team chat for engineering teams, startups, and remote-first companies. Channels, threads, file sharing, and instant full-text search — all with end-to-end encryption on by default. Fast, clean, and built to stay out of your way.

**Link columns** (headers = `text-caption` uppercase; only link to what exists — mark TBD items so they aren't shipped as dead links):

| Column | Links |
| --- | --- |
| Product | `Features` (`#features`), `Security` (`#security`), `Join the waitlist` (`#waitlist`) |
| Company | `Blog` (`/blog`) — *(About / Careers: TBD, omit until pages exist)* |
| Legal | *(Privacy, Terms: TBD — add when pages exist; don't ship dead links)* |

**Bottom row:**
- Copyright (`text-small`, `text-ink-500`): `© 2026 ChatPulse. All rights reserved.`
- Optional tagline next to wordmark: `Fast, searchable, private team chat.`

---

## 8. Reusable strings (buttons, labels, fragments)

Single source for repeated UI strings so components stay consistent.

| Key | Copy |
| --- | --- |
| CTA — primary | `Join the waitlist` |
| CTA — early access | `Get early access` |
| CTA — secondary (features) | `See how it works` |
| CTA — blog | `Read the blog` |
| Waitlist microcopy | `Be first in when we launch. No spam, unsubscribe anytime.` |
| Waitlist success | `You're on the list. We'll email you the moment ChatPulse opens up.` |
| Elevator pitch (1 line) | `ChatPulse is fast, searchable, end-to-end-encrypted team chat built for how engineering teams actually work.` |
| Six-word | `Encrypted, real-time chat for engineers.` |

**Approved CTA verbs only** (CHA-7 §7): "Join the waitlist," "Get early access," "Read the blog," "See how it works." Avoid "Sign up free" (no pricing) and "Get started" (no product to start yet).

---

## 9. Acceptance-criteria coverage

- [x] **Hero** — headline, subhead, eyebrow, primary + secondary CTA, microcopy, inline form strings (§2)
- [x] **Feature grid** — 6 benefit-first cards with feature named + micro-proof (§3)
- [x] **Social proof** — honest pre-launch audience proof, no fabricated metrics (§4)
- [x] **Security section** — dedicated section, 3 proof points, claims-disciplined (§5)
- [x] **CTA / footer** — final waitlist band + full footer copy + boilerplate (§6–§7)
- [x] **SEO** — title, meta description, OG copy, single-H1 heading outline (§0)
- [x] Copy for every planned section, drop-in ready with heading levels and component refs

## 10. Open decisions (for CEO / Founding Engineer)

1. **Positioning conflict (blocking a clean build):** analytics layer (`product-brief.md`) vs. team chat (`messaging-framework.md`, CHA-7). This copy follows CHA-7 per CHA-8. Confirm which product the site describes, then reconcile the two docs (bump the losing one). If it's analytics, this page needs a rewrite.
2. **Final H1:** Option A used ("Team chat that's fast, searchable, and private."). Alternatives in §2.
3. **Named integrations:** kept generic per CHA-7. Confirm no vendor names before launch.
4. **Security certifications:** none claimed. Add only after Engineering/Legal verify.

**Change control:** Revise `messaging-framework.md` first, then this doc; bump the version and date at the top of both.
