import assert from "node:assert/strict";
import { test } from "node:test";

import { RateLimiter, clientKey } from "../lib/rate-limit.ts";

// --- windows ---------------------------------------------------------------

test("requests within the limit are allowed", () => {
  const limiter = new RateLimiter(3, 60_000);
  const now = 1_000_000;
  assert.deepEqual(
    [1, 2, 3].map(() => limiter.check("a", now).ok),
    [true, true, true],
  );
});

test("the request past the limit is blocked", () => {
  const limiter = new RateLimiter(3, 60_000);
  const now = 1_000_000;
  for (let i = 0; i < 3; i += 1) limiter.check("a", now);

  const blocked = limiter.check("a", now);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.remaining, 0);
  assert.ok(
    blocked.retryAfterSeconds > 0,
    "a blocked caller is told when to retry",
  );
});

test("remaining counts down and never goes negative", () => {
  const limiter = new RateLimiter(2, 60_000);
  const now = 0;
  assert.equal(limiter.check("a", now).remaining, 1);
  assert.equal(limiter.check("a", now).remaining, 0);
  assert.equal(limiter.check("a", now).remaining, 0, "clamped at zero");
});

test("the window resets once it expires", () => {
  const limiter = new RateLimiter(1, 60_000);
  assert.equal(limiter.check("a", 0).ok, true);
  assert.equal(limiter.check("a", 30_000).ok, false, "still inside the window");
  assert.equal(limiter.check("a", 60_001).ok, true, "a fresh window");
});

test("clients are counted separately", () => {
  const limiter = new RateLimiter(1, 60_000);
  assert.equal(limiter.check("a", 0).ok, true);
  assert.equal(
    limiter.check("b", 0).ok,
    true,
    "one noisy client cannot block another",
  );
  assert.equal(limiter.check("a", 0).ok, false);
});

test("retryAfterSeconds shrinks as the window elapses", () => {
  const limiter = new RateLimiter(1, 60_000);
  limiter.check("a", 0);
  const early = limiter.check("a", 1_000).retryAfterSeconds;
  const late = limiter.check("a", 50_000).retryAfterSeconds;
  assert.ok(late < early, `${late} should be less than ${early}`);
  assert.ok(late >= 1, "never advertises a zero-second retry");
});

// --- client identification -------------------------------------------------

test("clientKey prefers the left-most x-forwarded-for entry", () => {
  const request = new Request("https://example.com", {
    headers: { "x-forwarded-for": "203.0.113.5, 70.41.3.18, 150.172.238.178" },
  });
  assert.equal(clientKey(request), "203.0.113.5");
});

test("clientKey falls back to x-real-ip, then a constant", () => {
  const withReal = new Request("https://example.com", {
    headers: { "x-real-ip": "198.51.100.9" },
  });
  assert.equal(clientKey(withReal), "198.51.100.9");
  assert.equal(clientKey(new Request("https://example.com")), "unknown");
});

test("an empty forwarded header does not produce an empty key", () => {
  // An empty key would put every anonymous caller in one bucket by accident,
  // which is the same outcome but for the wrong reason — and a blank-prefixed
  // header would otherwise shadow x-real-ip.
  const request = new Request("https://example.com", {
    headers: {
      "x-forwarded-for": " , 70.41.3.18",
      "x-real-ip": "198.51.100.9",
    },
  });
  assert.equal(clientKey(request), "198.51.100.9");
});
