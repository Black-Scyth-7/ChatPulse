import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const POSTS_DIR = path.join(process.cwd(), "content", "blog");

export interface PostFrontmatter {
  title: string;
  description?: string;
  date?: string;
  author?: string;
}

export interface PostSummary extends PostFrontmatter {
  slug: string;
}

export interface Post extends PostSummary {
  content: string;
}

function isPostFile(file: string): boolean {
  return file.endsWith(".mdx") || file.endsWith(".md");
}

export function getPostSlugs(dir: string = POSTS_DIR): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(isPostFile)
    .map((file) => file.replace(/\.mdx?$/, ""));
}

export function getPostBySlug(
  slug: string,
  dir: string = POSTS_DIR,
): Post | null {
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);
  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    content,
    title: (data.title as string) ?? slug,
    description: data.description as string | undefined,
    date: data.date as string | undefined,
    author: data.author as string | undefined,
  };
}

export function getAllPosts(dir: string = POSTS_DIR): PostSummary[] {
  return getPostSlugs(dir)
    .map((slug) => {
      const post = getPostBySlug(slug, dir);
      if (!post) return null;
      const { content: _content, ...summary } = post;
      void _content;
      return summary;
    })
    .filter((post): post is PostSummary => post !== null)
    .sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : 0));
}

/**
 * Format an ISO date (`YYYY-MM-DD`) as a human-readable label, e.g.
 * "July 13, 2026". Parsing/formatting are pinned to UTC so the output is
 * deterministic across server/build timezones. Returns the raw input
 * unchanged if it is missing or not a valid date.
 */
export function formatDate(date: string | undefined): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
