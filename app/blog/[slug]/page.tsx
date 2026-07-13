import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  return { title: post ? `${post.title} — ChatPulse` : "Post not found" };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <article className="prose prose-neutral max-w-none dark:prose-invert">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        {post.date ? (
          <time className="mb-8 block text-sm text-gray-500">{post.date}</time>
        ) : null}
        <div className="mt-6 space-y-4 leading-relaxed">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </main>
  );
}
