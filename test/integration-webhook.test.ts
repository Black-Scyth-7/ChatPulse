import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

import { notifyIntegration, type WaitlistRecord } from "../lib/waitlist.ts";

const RECORD: WaitlistRecord = {
  email: "hook@example.com",
  createdAt: "2026-01-01T00:00:00.000Z",
  source: "hero",
};

const realFetch = globalThis.fetch;
const realUrl = process.env.WAITLIST_WEBHOOK_URL;
const realError = console.error;

afterEach(() => {
  globalThis.fetch = realFetch;
  console.error = realError;
  if (realUrl === undefined) delete process.env.WAITLIST_WEBHOOK_URL;
  else process.env.WAITLIST_WEBHOOK_URL = realUrl;
});

test("no webhook configured means no request", async () => {
  delete process.env.WAITLIST_WEBHOOK_URL;
  let called = false;
  globalThis.fetch = (async () => {
    called = true;
    return new Response(null, { status: 200 });
  }) as typeof fetch;

  await notifyIntegration(RECORD);
  assert.equal(called, false);
});

test("a configured webhook receives the record as JSON", async () => {
  process.env.WAITLIST_WEBHOOK_URL = "https://hooks.example.com/waitlist";
  let seen: { url: string; init: RequestInit } | null = null;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    seen = { url, init };
    return new Response(null, { status: 200 });
  }) as unknown as typeof fetch;

  await notifyIntegration(RECORD);

  assert.ok(seen, "the webhook was called");
  const call = seen as unknown as { url: string; init: RequestInit };
  assert.equal(call.url, "https://hooks.example.com/waitlist");
  assert.equal(call.init.method, "POST");
  assert.deepEqual(JSON.parse(String(call.init.body)), RECORD);
  assert.ok(call.init.signal, "a timeout signal is attached");
});

test("a rejected delivery is logged, not swallowed", async () => {
  // fetch does not throw on 4xx/5xx, so without an explicit check a refused
  // delivery is indistinguishable from a successful one.
  process.env.WAITLIST_WEBHOOK_URL = "https://hooks.example.com/waitlist";
  const logged: string[] = [];
  console.error = (...args: unknown[]) => void logged.push(args.join(" "));
  globalThis.fetch = (async () =>
    new Response("nope", { status: 500 })) as typeof fetch;

  await notifyIntegration(RECORD);
  assert.ok(
    logged.some((line) => line.includes("500")),
    `expected the status to be logged, got ${JSON.stringify(logged)}`,
  );
});

test("a network failure never propagates to the caller", async () => {
  // The signup is already stored; telling someone it failed when it did not is
  // worse than a missing CRM row.
  process.env.WAITLIST_WEBHOOK_URL = "https://hooks.example.com/waitlist";
  console.error = () => {};
  globalThis.fetch = (async () => {
    throw new Error("ECONNREFUSED");
  }) as typeof fetch;

  await assert.doesNotReject(() => notifyIntegration(RECORD));
});

test("a hanging webhook is abandoned rather than held open", async () => {
  process.env.WAITLIST_WEBHOOK_URL = "https://hooks.example.com/waitlist";
  console.error = () => {};
  globalThis.fetch = ((_url: string, init: RequestInit) =>
    new Promise((_resolve, reject) => {
      // Never resolves; only the abort signal ends it.
      init.signal?.addEventListener("abort", () =>
        reject(new Error("aborted")),
      );
    })) as unknown as typeof fetch;

  const started = Date.now();
  await notifyIntegration(RECORD);
  const elapsed = Date.now() - started;

  assert.ok(
    elapsed < 10_000,
    `should abort on its own timeout, waited ${elapsed}ms`,
  );
});
