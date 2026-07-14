import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import {
  FileWaitlistStore,
  MemoryWaitlistStore,
  isValidEmail,
  normalizeEmail,
  submitToWaitlist,
  type WaitlistStore,
} from "../lib/waitlist.ts";

// --- validation ------------------------------------------------------------

test("isValidEmail accepts well-formed addresses", () => {
  for (const email of ["a@b.co", "user.name+tag@example.com", "x@sub.domain.io"]) {
    assert.equal(isValidEmail(email), true, email);
  }
});

test("isValidEmail rejects malformed / non-string / oversized input", () => {
  for (const bad of [
    "",
    "   ",
    "no-at-sign",
    "no@domain",
    "spaces in@email.com",
    "two@@at.com",
    42,
    null,
    undefined,
    {},
    `${"a".repeat(250)}@example.com`, // > 254 chars
  ]) {
    assert.equal(isValidEmail(bad), false, JSON.stringify(bad));
  }
});

test("normalizeEmail trims and lowercases", () => {
  assert.equal(normalizeEmail("  Foo@Bar.COM "), "foo@bar.com");
});

// --- submit orchestration --------------------------------------------------

test("submitToWaitlist rejects invalid email with 400", async () => {
  const store = new MemoryWaitlistStore();
  const res = await submitToWaitlist("nope", store);
  assert.deepEqual(res, { ok: false, code: "invalid_email", status: 400 });
  assert.equal(store.records.length, 0);
});

test("submitToWaitlist persists a valid signup and returns 200", async () => {
  const store = new MemoryWaitlistStore();
  const res = await submitToWaitlist("New@Example.com", store, { source: "hero" });
  assert.equal(res.ok, true);
  assert.equal(store.records.length, 1);
  const [record] = store.records;
  assert.equal(record.email, "new@example.com"); // normalized
  assert.equal(record.source, "hero");
  assert.match(record.createdAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("submitToWaitlist dedupes case/whitespace-insensitively with 409", async () => {
  const store = new MemoryWaitlistStore();
  const first = await submitToWaitlist("dupe@example.com", store);
  assert.equal(first.ok, true);

  const second = await submitToWaitlist("  DUPE@Example.com  ", store);
  assert.deepEqual(second, { ok: false, code: "already_joined", status: 409 });
  assert.equal(store.records.length, 1, "duplicate must not be persisted twice");
});

test("submitToWaitlist maps store failures to 500", async () => {
  const failing: WaitlistStore = {
    has: async () => false,
    add: async () => {
      throw new Error("disk on fire");
    },
  };
  const res = await submitToWaitlist("boom@example.com", failing);
  assert.deepEqual(res, { ok: false, code: "storage_error", status: 500 });
});

// --- file store persistence ------------------------------------------------

test("FileWaitlistStore persists JSONL, dedupes, and survives reload", async () => {
  const dir = await mkdtemp(join(tmpdir(), "waitlist-"));
  after(() => rm(dir, { recursive: true, force: true }));
  const file = join(dir, "nested", "waitlist.jsonl");

  const store = new FileWaitlistStore(file);
  assert.equal(await store.has("a@example.com"), false);

  await submitToWaitlist("a@example.com", store, { source: "cta" });
  await submitToWaitlist("b@example.com", store);
  const dup = await submitToWaitlist("A@example.com", store);
  assert.equal(dup.ok, false); // deduped against persisted data

  const lines = (await readFile(file, "utf8")).trim().split("\n");
  assert.equal(lines.length, 2, "only two unique signups written");
  assert.equal(JSON.parse(lines[0]).email, "a@example.com");

  // A fresh store instance must see prior signups (dedupe survives restart).
  const reloaded = new FileWaitlistStore(file);
  assert.equal(await reloaded.has("b@example.com"), true);
  const again = await submitToWaitlist("b@example.com", reloaded);
  assert.equal(again.ok, false);
});

test("FileWaitlistStore serializes concurrent signups without dropping data", async () => {
  const dir = await mkdtemp(join(tmpdir(), "waitlist-conc-"));
  after(() => rm(dir, { recursive: true, force: true }));
  const store = new FileWaitlistStore(join(dir, "waitlist.jsonl"));

  const emails = Array.from({ length: 25 }, (_, i) => `user${i}@example.com`);
  const results = await Promise.all(
    emails.map((email) => submitToWaitlist(email, store)),
  );
  assert.ok(results.every((r) => r.ok), "all distinct concurrent signups succeed");

  const file = join(dir, "waitlist.jsonl");
  const lines = (await readFile(file, "utf8")).trim().split("\n");
  assert.equal(lines.length, 25, "no appends lost to interleaving");
});
