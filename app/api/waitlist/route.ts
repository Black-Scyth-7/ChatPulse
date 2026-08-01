import { NextResponse } from "next/server";

import { clientKey, waitlistLimiter } from "@/lib/rate-limit";
import {
  getWaitlistStore,
  notifyIntegration,
  submitToWaitlist,
} from "@/lib/waitlist";

/**
 * Waitlist signup endpoint. Rate-limits, validates the email, dedupes, and
 * persists via the configured store (append-only JSONL by default — see
 * docs/waitlist-integration.md). All domain logic lives in lib/waitlist.ts and
 * is unit-tested; this handler only adapts HTTP ⇄ domain.
 *
 * Responses (contract consumed by components/landing/WaitlistForm.tsx):
 *   200 { ok: true }           — joined
 *   400 { error: "invalid_body" | "invalid_email" }
 *   409 { error: "already_joined" }
 *   413 { error: "invalid_body" }  — body too large
 *   429 { error: "rate_limited" }
 *   500 { error: "storage_error" }
 */
export const runtime = "nodejs"; // FileWaitlistStore uses node:fs.

/** Reject bodies larger than this before parsing them. */
const MAX_BODY_BYTES = 4096;

export async function POST(request: Request) {
  const limit = waitlistLimiter.check(clientKey(request));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: {
          // Without this the client has to guess, and the usual guess is
          // "immediately", which turns a limit into a retry loop.
          "Retry-After": String(limit.retryAfterSeconds),
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // An email is at most 254 characters, so anything large is not a signup.
  // Checked before parsing so an oversized body is never buffered into JSON.
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "invalid_body" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = (body as { email?: unknown } | null)?.email;
  const source = (body as { source?: unknown } | null)?.source;

  const result = await submitToWaitlist(email, getWaitlistStore(), {
    // Bounded: `source` is client-supplied and gets written to storage.
    source: typeof source === "string" ? source.slice(0, 64) : undefined,
  });

  if (result.ok) {
    // Awaited, not fire-and-forget. A serverless instance can be frozen the
    // moment the response is returned, and with the default store on an
    // ephemeral filesystem this webhook is the durable record — so work left
    // running after the response is exactly the work that must not be lost.
    // It has its own timeout and never throws.
    await notifyIntegration(result.record);
    return NextResponse.json(
      { ok: true },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(limit.limit),
          "X-RateLimit-Remaining": String(limit.remaining),
        },
      },
    );
  }

  return NextResponse.json({ error: result.code }, { status: result.status });
}
