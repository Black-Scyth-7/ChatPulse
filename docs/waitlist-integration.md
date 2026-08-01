# Waitlist API — storage & integration (CHA-11)

Backs the landing waitlist form (`components/landing/WaitlistForm.tsx`) via
`POST /api/waitlist`. Domain logic lives in `lib/waitlist.ts`; the route handler
(`app/api/waitlist/route.ts`) is a thin HTTP adapter.

## API contract

`POST /api/waitlist`

Request body (JSON): `{ "email": string, "source"?: string }`

| Status | Body                            | Meaning                                  |
| ------ | ------------------------------- | ---------------------------------------- |
| 200    | `{ "ok": true }`                | Joined (new signup persisted)            |
| 400    | `{ "error": "invalid_body" }`   | Body was not valid JSON                  |
| 400    | `{ "error": "invalid_email" }`  | Email missing/malformed/too long (>254)  |
| 409    | `{ "error": "already_joined" }` | Email already on the list (deduped)      |
| 413    | `{ "error": "invalid_body" }`   | Body over 4 KB — rejected before parsing |
| 429    | `{ "error": "rate_limited" }`   | Over 5/min for this client; see below    |
| 500    | `{ "error": "storage_error" }`  | Persistence failed — signup not dropped  |

The client form maps 409→"already on the list", 400→"enter a valid email",
anything else→generic error. Emails are normalized (trim + lowercase) so
`Foo@Bar.com` and `foo@bar.com ` dedupe to one record.

## Storage choice (default): append-only JSONL file

`FileWaitlistStore` writes one JSON record per line to a file
(`WAITLIST_DATA_FILE`, default `.data/waitlist.jsonl`, gitignored). Dedupe is
served from an in-process cache seeded lazily from the file, and writes are
serialized through a promise queue so concurrent requests can't interleave
appends or race the initial load.

**Why this default:** zero external dependencies or credentials, durable across
restarts locally, trivially inspectable/exportable, and enough to make the
landing form fully functional in dev and single-instance/preview deploys.

**Limitations (known):**

- Not safe across multiple instances — each process keeps its own file/cache, so
  dedupe and durability assume a single writer.
- On read-only serverless filesystems (e.g. Vercel) only `/tmp` is writable and
  it is ephemeral. Point `WAITLIST_DATA_FILE` at `/tmp/...` there only as a
  stopgap, or switch to a managed store (below) before real launch traffic.

## Optional integration: webhook forward

If `WAITLIST_WEBHOOK_URL` is set, each confirmed signup is `POST`ed to it as
JSON (`{ email, createdAt, source? }`) via `notifyIntegration`. Wire it to
Zapier/Make, an ESP (ConvertKit/Mailchimp), or a CRM to sync signups without
app changes.

The request **awaits** the webhook (with a 3-second timeout) rather than firing
and forgetting it. On a serverless platform the instance can be frozen or
reclaimed the moment the response is returned, so work started but not awaited
is not guaranteed to run — and because the default store writes to an ephemeral
per-instance filesystem, this webhook is the durable record. Losing it is the
one failure that actually loses a signup.

Failures — a network error, a timeout, or a non-2xx status — are logged and
never fail the user's request: the address is already stored, and telling
someone their signup failed when it did not is worse than a missing CRM row.

## Rate limiting

`POST /api/waitlist` allows 5 signups per minute per client, keyed on
`x-forwarded-for`. Over the limit it answers `429` with `Retry-After`.

The counters live in one process, so on a serverless platform each instance
keeps its own and the effective ceiling is roughly `limit × instances`. That is
a speed bump, not a quota — put a real limiter at the edge (Vercel WAF,
Cloudflare) if the endpoint attracts sustained abuse. `x-forwarded-for` is also
client-supplied and spoofable, so the key identifies a caller only as far as the
proxy in front is trustworthy.

## Deduplication

`WaitlistStore.addIfAbsent` performs the "is it there / insert it" test as a
single operation. It used to be `has()` followed by `add()` — two separately
awaited steps, so two concurrent signups for the same address could both observe
"absent" and both insert. Any replacement store must preserve that atomicity;
with a database, a unique index on the email column is the natural way.

Note that dedupe is still per-instance with the default file store: two
serverless instances have separate files and separate caches, so the same
address can be recorded once on each. A managed store (below) is what makes
dedupe global.

## Migration path to a managed store

Swap the persistence target by implementing the `WaitlistStore` interface
(`has(email)` / `add(record)`) and returning it from `getWaitlistStore()`. Good
production targets: a hosted Postgres (Neon/Supabase, unique index on email for
DB-level dedupe), or Vercel KV/Upstash Redis (`SET NX` on the email key). No
route or form changes required — the interface is the seam.

## Environment variables

| Var                    | Default                | Purpose                              |
| ---------------------- | ---------------------- | ------------------------------------ |
| `WAITLIST_DATA_FILE`   | `.data/waitlist.jsonl` | JSONL persistence path               |
| `WAITLIST_WEBHOOK_URL` | _(unset)_              | Optional downstream integration POST |

## Tests

`npm test` runs `test/waitlist.test.ts` (Node's built-in test runner, no extra
deps) covering validation, normalization, dedupe, the 400/409/500 paths, file
persistence + reload, and concurrent-write serialization.
