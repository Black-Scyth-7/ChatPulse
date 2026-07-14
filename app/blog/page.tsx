import Link from "next/link";
import { formatDate, getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
  description:
    "Product updates, engineering notes, and thinking behind ChatPulse.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
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
        className="mx-auto max-w-content px-6 py-section-sm md:py-section"
      >
        <h1 className="text-h2 text-ink-900 dark:text-ink-100">Blog</h1>
        <p className="mt-3 text-body-lg text-ink-500 dark:text-ink-400">
          {metadata.description}
        </p>

        {posts.length === 0 ? (
          <p className="mt-10 text-body text-ink-500 dark:text-ink-400">
            No posts yet — check back soon.
          </p>
        ) : (
          <ul className="mt-10 space-y-4">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block rounded-lg border border-ink-200 p-6 shadow-xs transition-colors hover:border-brand-400 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:border-ink-800 dark:hover:border-brand-500"
                >
                  <h2 className="text-h4 text-ink-900 dark:text-ink-100">
                    {post.title}
                  </h2>
                  {post.description ? (
                    <p className="mt-2 text-body text-ink-600 dark:text-ink-300">
                      {post.description}
                    </p>
                  ) : null}
                  {post.date || post.author ? (
                    <p className="mt-3 text-small text-ink-500 dark:text-ink-400">
                      {post.date ? (
                        <time dateTime={post.date}>
                          {formatDate(post.date)}
                        </time>
                      ) : null}
                      {post.date && post.author ? " · " : null}
                      {post.author ? <span>{post.author}</span> : null}
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
