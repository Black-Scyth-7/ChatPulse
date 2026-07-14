import { NextResponse } from "next/server";

/**
 * Minimal waitlist submit endpoint. Persistence is a separate ticket (see
 * docs/landing-sections.md §7) — this validates the email and acknowledges so
 * the landing form is fully functional (loading → success/error) in preview.
 *
 * In-memory Set only dedupes within a single server instance; it is not durable
 * storage and resets on redeploy. Good enough to exercise the 409 path.
 */
const seen = new Set<string>();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  if (seen.has(normalized)) {
    return NextResponse.json({ error: "already_joined" }, { status: 409 });
  }
  seen.add(normalized);

  return NextResponse.json({ ok: true }, { status: 200 });
}
