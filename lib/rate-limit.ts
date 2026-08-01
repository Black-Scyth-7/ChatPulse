/**
 * Fixed-window rate limiting, in process.
 *
 * The waitlist endpoint is unauthenticated, appends to disk, and calls an
 * outbound webhook per signup, so it needs some ceiling. This one is
 * deliberately small: no Redis, no new dependency.
 *
 * **What this does not do.** The counters live in one process, so on a
 * serverless platform each instance keeps its own and the effective ceiling is
 * roughly `limit × instances`. That is a real limitation, not an oversight —
 * it raises the cost of a flood without pretending to be a distributed
 * quota. Put a proper limiter at the edge (Vercel WAF, Cloudflare) if the
 * endpoint ever attracts real abuse.
 */

export interface RateLimitResult {
  ok: boolean;
  /** Requests allowed per window. */
  limit: number;
  /** Requests left in the current window; 0 once blocked. */
  remaining: number;
  /** Seconds until the window resets — the value for `Retry-After`. */
  retryAfterSeconds: number;
}

interface Window {
  count: number;
  /** Epoch ms at which this window expires. */
  resetAt: number;
}

/**
 * Cap on tracked keys. Without it, one address per request would grow the map
 * without bound — turning a defence against abuse into the thing that runs the
 * process out of memory.
 */
const MAX_TRACKED_KEYS = 10_000;

export class RateLimiter {
  private readonly windows = new Map<string, Window>();
  private readonly limit: number;
  private readonly windowMs: number;

  // Fields are declared and assigned explicitly rather than using constructor
  // parameter properties: the test suite runs `.ts` through Node's strip-only
  // type removal, which cannot compile that syntax.
  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /** Record a hit for `key` and report whether it is allowed. */
  check(key: string, now: number = Date.now()): RateLimitResult {
    const existing = this.windows.get(key);

    if (!existing || existing.resetAt <= now) {
      this.evictIfCrowded(now);
      this.windows.set(key, { count: 1, resetAt: now + this.windowMs });
      return {
        ok: true,
        limit: this.limit,
        remaining: this.limit - 1,
        retryAfterSeconds: Math.ceil(this.windowMs / 1000),
      };
    }

    existing.count += 1;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((existing.resetAt - now) / 1000),
    );
    return {
      ok: existing.count <= this.limit,
      limit: this.limit,
      remaining: Math.max(0, this.limit - existing.count),
      retryAfterSeconds,
    };
  }

  /** Drop expired windows, and the oldest entries if still over the cap. */
  private evictIfCrowded(now: number): void {
    if (this.windows.size < MAX_TRACKED_KEYS) return;

    for (const [key, window] of this.windows) {
      if (window.resetAt <= now) this.windows.delete(key);
    }
    if (this.windows.size < MAX_TRACKED_KEYS) return;

    // Everything is still live: drop the entries closest to resetting, which
    // are the ones whose loss matters least.
    const oldest = [...this.windows.entries()]
      .sort((a, b) => a[1].resetAt - b[1].resetAt)
      .slice(0, Math.ceil(MAX_TRACKED_KEYS / 10));
    for (const [key] of oldest) this.windows.delete(key);
  }

  /** Testing hook. */
  reset(): void {
    this.windows.clear();
  }
}

/**
 * Best-effort client identifier.
 *
 * `x-forwarded-for` is client-controlled and trivially spoofed, so this is a
 * speed bump rather than an identity. The left-most entry is the original
 * client when a trusted proxy appends to the header, which is what Vercel and
 * most CDNs do.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Shared limiter for the waitlist endpoint: 5 signups per minute per client. */
export const waitlistLimiter = new RateLimiter(5, 60_000);
