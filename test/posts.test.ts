import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";

import {
  formatDate,
  getAllPosts,
  getPostBySlug,
  getPostSlugs,
} from "../lib/posts.ts";

async function fixtureDir(files: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "posts-"));
  after(() => rm(dir, { recursive: true, force: true }));
  await Promise.all(
    Object.entries(files).map(([name, body]) =>
      writeFile(join(dir, name), body, "utf8"),
    ),
  );
  return dir;
}

const post = (fm: Record<string, string>, body = "Hello body.") =>
  `---\n${Object.entries(fm)
    .map(([k, v]) => `${k}: "${v}"`)
    .join("\n")}\n---\n\n${body}\n`;

// --- slug discovery --------------------------------------------------------

test("getPostSlugs returns .md/.mdx basenames and ignores other files", async () => {
  const dir = await fixtureDir({
    "a.mdx": post({ title: "A" }),
    "b.md": post({ title: "B" }),
    "notes.txt": "ignore me",
    "draft.json": "{}",
  });
  assert.deepEqual(getPostSlugs(dir).sort(), ["a", "b"]);
});

test("getPostSlugs returns [] for a missing directory", () => {
  assert.deepEqual(getPostSlugs(join(tmpdir(), "does-not-exist-xyz")), []);
});

// --- frontmatter parsing ---------------------------------------------------

test("getPostBySlug parses title, description, date, author + body", async () => {
  const dir = await fixtureDir({
    "hello.mdx": post({
      title: "Hello",
      description: "A desc",
      date: "2026-07-13",
      author: "Ada Lovelace",
    }),
  });
  const p = getPostBySlug("hello", dir);
  assert.ok(p);
  assert.equal(p.title, "Hello");
  assert.equal(p.description, "A desc");
  assert.equal(p.date, "2026-07-13");
  assert.equal(p.author, "Ada Lovelace");
  assert.match(p.content, /Hello body\./);
});

test("getPostBySlug falls back to slug as title and leaves optional fields undefined", async () => {
  const dir = await fixtureDir({ "bare.mdx": "no frontmatter here\n" });
  const p = getPostBySlug("bare", dir);
  assert.ok(p);
  assert.equal(p.title, "bare");
  assert.equal(p.description, undefined);
  assert.equal(p.author, undefined);
});

test("getPostBySlug returns null for an unknown slug", async () => {
  const dir = await fixtureDir({ "a.mdx": post({ title: "A" }) });
  assert.equal(getPostBySlug("missing", dir), null);
});

// --- index ordering --------------------------------------------------------

test("getAllPosts sorts newest-first by date and omits body content", async () => {
  const dir = await fixtureDir({
    "old.mdx": post({ title: "Old", date: "2026-01-01" }),
    "new.mdx": post({ title: "New", date: "2026-12-31" }),
    "mid.mdx": post({ title: "Mid", date: "2026-06-15" }),
  });
  const posts = getAllPosts(dir);
  assert.deepEqual(
    posts.map((p) => p.slug),
    ["new", "mid", "old"],
  );
  assert.ok(!("content" in posts[0]));
});

// --- date formatting -------------------------------------------------------

test("formatDate renders a UTC-stable human label", () => {
  assert.equal(formatDate("2026-07-13"), "July 13, 2026");
});

test("formatDate passes through empty/invalid input unchanged", () => {
  assert.equal(formatDate(undefined), "");
  assert.equal(formatDate("not-a-date"), "not-a-date");
});
