# Waitlist API — storage & integration (CHA-11)

Backs the landing waitlist form (`components/landing/WaitlistForm.tsx`) via
`POST /api/waitlist`. Domain logic lives in `lib/waitlist.ts`; the route handler
(`app/api/waitlist/route.ts`) is a thin HTTP adapter.

## API contract

`POST /api/waitlist`

Request body (JSON): `{ "email": string, "source"?: string }`

| Status | Body                          | Meaning                                  |
| ------ | ----------------------------- | ---------------------------------------- |
| 200    | `{ "ok": true }`              | Joined (new signup persisted)            |
| 400    | `{ "error": "invalid_body" }` | Body was not valid JSON                  |
| 400    | `{ "error": "invalid_email" }`| Email missing/malformed/too long (>254)  |
| 409    | `{ "error": "already_joined" }`| Email already on the list (deduped)     |
| 500    | `{ "error": "storage_error" }`| Persistence failed — signup not dropped  |

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
JSON (`{ email, createdAt, source? }`) via `notifyIntegration`. This is
fire-and-forget: the record is already persisted, so webhook failures are logged
and never fail the user's request. Wire it to Zapier/Make, an ESP
(ConvertKit/Mailchimp), or a CRM to sync signups without app changes.

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
