import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { JsonLd } from "@/components/JsonLd";
import { formatDate, getPostBySlug, getPostSlugs } from "@/lib/posts";
import { absoluteUrl, siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Post not found" };
  const canonical = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: absoluteUrl(canonical),
      title: post.title,
      description: post.description,
      ...(post.date ? { publishedTime: post.date } : {}),
      ...(post.author ? { authors: [post.author] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    ...(post.description ? { description: post.description } : {}),
    ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
    ...(post.author
      ? { author: { "@type": "Person", name: post.author } }
      : {}),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon") },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${post.slug}`),
    },
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <header className="border-b border-ink-200 dark:border-ink-800">
        <div className="mx-auto flex h-16 max-w-content items-center px-6">
          <Link
            href="/"
            className="rounded text-body-lg font-semibold text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:text-ink-100"
          >
            ChatPulse
          </Link>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto max-w-prose px-6 py-section-sm md:py-section"
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 rounded text-small font-medium text-brand-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:text-brand-400"
        >
          <span aria-hidden>←</span> Back to blog
        </Link>

        <article className="mt-8">
          <header className="mb-8">
            <h1 className="text-h2 text-ink-900 dark:text-ink-100">
              {post.title}
            </h1>
            {post.date || post.author ? (
              <p className="mt-4 text-small text-ink-500 dark:text-ink-400">
                {post.author ? <span>{post.author}</span> : null}
                {post.date && post.author ? " · " : null}
                {post.date ? (
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                ) : null}
              </p>
            ) : null}
          </header>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <MDXRemote source={post.content} />
          </div>
        </article>
      </main>
    </>
  );
}
