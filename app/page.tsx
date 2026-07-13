import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        ChatPulse
      </h1>
      <p className="max-w-xl text-lg text-gray-600 dark:text-gray-300">
        Real-time conversation insights. The project scaffold is up and running.
      </p>
      <Link
        href="/blog"
        className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Read the blog
      </Link>
    </main>
  );
}
