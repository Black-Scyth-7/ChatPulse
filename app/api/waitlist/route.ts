import { NextResponse } from "next/server";
import {
  getWaitlistStore,
  notifyIntegration,
  submitToWaitlist,
} from "@/lib/waitlist";

/**
 * Waitlist signup endpoint. Validates the email, dedupes, and persists via the
 * configured store (append-only JSONL by default — see
 * docs/waitlist-integration.md). All domain logic lives in lib/waitlist.ts and
 * is unit-tested; this handler only adapts HTTP ⇄ domain.
 *
 * Responses (contract consumed by components/landing/WaitlistForm.tsx):
 *   200 { ok: true }           — joined
 *   400 { error: "invalid_body" | "invalid_email" }
 *   409 { error: "already_joined" }
 *   500 { error: "storage_error" }
 */
export const runtime = "nodejs"; // FileWaitlistStore uses node:fs.

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const email = (body as { email?: unknown } | null)?.email;
  const source = (body as { source?: unknown } | null)?.source;

  const result = await submitToWaitlist(email, getWaitlistStore(), {
    source: typeof source === "string" ? source : undefined,
  });

  if (result.ok) {
    // Fire-and-forget: the record is already persisted; don't block the
    // response on an optional downstream integration.
    void notifyIntegration(result.record);
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  return NextResponse.json({ error: result.code }, { status: result.status });
}
