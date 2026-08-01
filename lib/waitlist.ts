import { appendFile, mkdir, readFile } from "node:fs/promises";
import { dirname } from "node:path";

/**
 * Waitlist domain logic: validation, normalization, dedupe, and persistence.
 *
 * The HTTP route (app/api/waitlist/route.ts) is a thin adapter over
 * `submitToWaitlist` so all behaviour here is unit-testable without spinning up
 * Next.js. Persistence is pluggable via the `WaitlistStore` interface; the
 * production default is an append-only JSONL file (see docs/waitlist-integration.md).
 */

// Pragmatic RFC-5322-lite check — mirrors the client-side guard in
// components/landing/WaitlistForm.tsx. The server is the authoritative validator.
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Guard against absurd inputs before they ever touch storage. */
const MAX_EMAIL_LENGTH = 254; // RFC 5321 max length of an email address.

export interface WaitlistRecord {
  email: string;
  /** Free-form provenance, e.g. "hero" | "cta". Optional. */
  source?: string;
  /** ISO-8601 timestamp of signup. */
  createdAt: string;
}

export interface WaitlistStore {
  /** True if this (already-normalized) email is present. */
  has(email: string): Promise<boolean>;
  /** Persist a new record unconditionally. Prefer `addIfAbsent`. */
  add(record: WaitlistRecord): Promise<void>;
  /**
   * Insert only if the email is absent. Returns false when it was already
   * there.
   *
   * This has to be one operation, not `has` followed by `add`. Those are two
   * separately-awaited steps, so two concurrent signups for the same address
   * can both observe "absent" and both insert — a check-then-act race that
   * writes the address twice. An implementation must perform the test and the
   * insert without yielding between them.
   */
  addIfAbsent(record: WaitlistRecord): Promise<boolean>;
}

export type WaitlistResult =
  | { ok: true; record: WaitlistRecord }
  | { ok: false; code: "invalid_email"; status: 400 }
  | { ok: false; code: "already_joined"; status: 409 }
  | { ok: false; code: "storage_error"; status: 500 };

/** Lower-case + trim so `Foo@Bar.com ` and `foo@bar.com` dedupe together. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: unknown): email is string {
  return (
    typeof email === "string" &&
    email.trim().length > 0 &&
    email.trim().length <= MAX_EMAIL_LENGTH &&
    EMAIL_RE.test(email.trim())
  );
}

/**
 * Validate → dedupe → persist. Pure orchestration over an injected store so
 * tests can supply an in-memory implementation.
 */
export async function submitToWaitlist(
  rawEmail: unknown,
  store: WaitlistStore,
  meta: { source?: string } = {},
): Promise<WaitlistResult> {
  if (!isValidEmail(rawEmail)) {
    return { ok: false, code: "invalid_email", status: 400 };
  }

  const email = normalizeEmail(rawEmail);

  try {
    const record: WaitlistRecord = {
      email,
      createdAt: new Date().toISOString(),
      ...(meta.source ? { source: meta.source } : {}),
    };

    // One call, not `has` then `add`: see WaitlistStore.addIfAbsent.
    if (!(await store.addIfAbsent(record))) {
      return { ok: false, code: "already_joined", status: 409 };
    }
    return { ok: true, record };
  } catch {
    // Persistence failed — surface a 500 so signups are never silently dropped.
    return { ok: false, code: "storage_error", status: 500 };
  }
}

/**
 * In-memory store. Not durable (resets on restart) — used for tests and as a
 * fallback when no file path is configured.
 */
export class MemoryWaitlistStore implements WaitlistStore {
  private readonly emails = new Set<string>();
  readonly records: WaitlistRecord[] = [];

  async has(email: string): Promise<boolean> {
    return this.emails.has(email);
  }

  async add(record: WaitlistRecord): Promise<void> {
    this.emails.add(record.email);
    this.records.push(record);
  }

  async addIfAbsent(record: WaitlistRecord): Promise<boolean> {
    // No await between the test and the insert, so nothing can interleave.
    if (this.emails.has(record.email)) return false;
    this.emails.add(record.email);
    this.records.push(record);
    return true;
  }
}

/**
 * Append-only JSONL file store. One JSON record per line; dedupe is served from
 * an in-process cache seeded lazily from the file. Writes are serialized through
 * a promise chain so concurrent requests can't interleave appends or races on
 * the load. Suitable for a single instance / preview deploys; see
 * docs/waitlist-integration.md for the durable-provider migration path.
 */
export class FileWaitlistStore implements WaitlistStore {
  private cache: Set<string> | null = null;
  /** Serializes load + append so operations never interleave. */
  private queue: Promise<unknown> = Promise.resolve();
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private run<T>(op: () => Promise<T>): Promise<T> {
    const result = this.queue.then(op, op);
    // Keep the chain alive even if an op rejects; swallow here, surface in op.
    this.queue = result.catch(() => undefined);
    return result;
  }

  private async ensureLoaded(): Promise<Set<string>> {
    if (this.cache) return this.cache;
    const cache = new Set<string>();
    try {
      const contents = await readFile(this.filePath, "utf8");
      for (const line of contents.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const record = JSON.parse(trimmed) as Partial<WaitlistRecord>;
          if (typeof record.email === "string") cache.add(record.email);
        } catch {
          // Skip malformed lines rather than failing the whole load.
        }
      }
    } catch (err) {
      // ENOENT is expected on first run; anything else is a real failure.
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
    this.cache = cache;
    return cache;
  }

  async has(email: string): Promise<boolean> {
    return this.run(async () => (await this.ensureLoaded()).has(email));
  }

  async add(record: WaitlistRecord): Promise<void> {
    return this.run(async () => {
      await this.write(record);
    });
  }

  async addIfAbsent(record: WaitlistRecord): Promise<boolean> {
    // The whole test-and-insert runs as a single queued operation, so a
    // concurrent signup for the same address waits behind it and then sees the
    // cache already populated. Splitting this into `has` + `add` queues two
    // operations and lets a second caller slip between them.
    return this.run(async () => {
      const cache = await this.ensureLoaded();
      if (cache.has(record.email)) return false;
      await this.write(record);
      return true;
    });
  }

  /** Append + cache. Callers must already hold the queue. */
  private async write(record: WaitlistRecord): Promise<void> {
    const cache = await this.ensureLoaded();
    await mkdir(dirname(this.filePath), { recursive: true });
    await appendFile(this.filePath, JSON.stringify(record) + "\n", "utf8");
    cache.add(record.email);
  }
}

let cachedStore: WaitlistStore | null = null;

/**
 * Default JSONL path. Vercel's serverless filesystem is read-only except for
 * `/tmp`, so writing to the repo-relative `.data/` there fails with EROFS and
 * every signup would 500. Default to `/tmp/waitlist.jsonl` on Vercel so the form
 * works out of the box; the file is ephemeral (per-instance, cleared on cold
 * start), so set `WAITLIST_WEBHOOK_URL` for durable capture. Override with
 * `WAITLIST_DATA_FILE` when pointing at a managed store's path.
 */
function defaultWaitlistPath(): string {
  return process.env.VERCEL ? "/tmp/waitlist.jsonl" : ".data/waitlist.jsonl";
}

/**
 * Process-wide singleton store. Uses the JSONL file store when a path is
 * configured (default from `defaultWaitlistPath()`), else an in-memory store.
 */
export function getWaitlistStore(): WaitlistStore {
  if (cachedStore) return cachedStore;
  const filePath = process.env.WAITLIST_DATA_FILE ?? defaultWaitlistPath();
  cachedStore = filePath
    ? new FileWaitlistStore(filePath)
    : new MemoryWaitlistStore();
  return cachedStore;
}

/** How long to wait on the integration webhook before giving up. */
const WEBHOOK_TIMEOUT_MS = 3000;

/**
 * Optional integration hook. If `WAITLIST_WEBHOOK_URL` is set, forward the
 * confirmed signup to it (Zapier/Make/CRM/ESP).
 *
 * The caller **awaits** this rather than firing and forgetting. On a serverless
 * platform the instance may be frozen or reclaimed as soon as the response is
 * returned, so work started but not awaited is not guaranteed to run — and
 * since the default JSONL store lives on an ephemeral per-instance filesystem,
 * this webhook is the durable record. Dropping it silently is the one failure
 * that actually loses a signup.
 *
 * The cost is the request waiting on the webhook, bounded by
 * `WEBHOOK_TIMEOUT_MS`. Failures are logged and never fail the signup: the
 * address is already stored, and telling someone their signup failed when it
 * did not is worse than a missing CRM row.
 */
export async function notifyIntegration(record: WaitlistRecord): Promise<void> {
  const url = process.env.WAITLIST_WEBHOOK_URL;
  if (!url) return;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      // Without this a hung endpoint holds the request open until the platform
      // kills it.
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    if (!response.ok) {
      // A 4xx/5xx does not throw, so it has to be checked explicitly or a
      // rejected delivery looks identical to a successful one.
      console.error(
        `[waitlist] integration webhook returned ${response.status} for ${record.email}`,
      );
    }
  } catch (err) {
    console.error("[waitlist] integration webhook failed:", err);
  }
}
