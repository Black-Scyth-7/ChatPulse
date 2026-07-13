import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog — ChatPulse",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No posts yet.</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {post.description ? (
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    {post.description}
                  </p>
                ) : null}
                {post.date ? (
                  <time className="mt-2 block text-sm text-gray-500">
                    {post.date}
                  </time>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
