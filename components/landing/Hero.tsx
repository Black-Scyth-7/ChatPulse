import Link from "next/link";
import { CTA } from "./content";
import { WaitlistForm } from "./WaitlistForm";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-section-sm md:py-section dark:bg-ink-950">
      {/* Decorative brand glow — purely aesthetic, hidden from AT and reduced motion. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-brand-500/20 to-pulse-500/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-wide px-6 md:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          {/* Copy column (first in source order for a11y + LCP) */}
          <div className="text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-caption font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-pulse-500"
              />
              Now building — join the waitlist
            </span>

            <h1 className="mx-auto mt-5 max-w-[14ch] text-h2 text-ink-900 md:mx-0 md:text-h1 dark:text-ink-100">
              Team chat that&rsquo;s fast, searchable, and private.
            </h1>

            <p className="mx-auto mt-5 max-w-content text-body-lg text-ink-600 md:mx-0 dark:text-ink-400">
              ChatPulse gives dev teams real-time messaging, threads, and
              full-text search &mdash; with end-to-end encryption on by default.
              Fast to set up, built to stay out of your way.
            </p>

            <WaitlistForm
              idPrefix="hero"
              className="mx-auto mt-8 max-w-md md:mx-0"
            />

            <div className="mt-6">
              <Link
                href="#features"
                className="inline-flex items-center rounded text-small font-medium text-ink-700 underline-offset-4 transition-colors hover:text-ink-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:text-ink-300 dark:hover:text-ink-100"
              >
                {CTA.seeHow} &rarr;
              </Link>
            </div>
          </div>

          {/* Product-visual placeholder — decorative, reserves space to avoid CLS */}
          <div
            aria-hidden
            className="mt-10 aspect-[4/3] w-full rounded-2xl border border-ink-200 bg-ink-50 shadow-overlay md:mt-0 dark:border-ink-800 dark:bg-ink-900"
          >
            <div className="flex h-full flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-ink-300 dark:bg-ink-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-300 dark:bg-ink-700" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-300 dark:bg-ink-700" />
              </div>
              <div className="mt-2 space-y-3">
                <div className="h-3 w-1/3 rounded bg-brand-200 dark:bg-brand-900" />
                <div className="h-3 w-2/3 rounded bg-ink-200 dark:bg-ink-800" />
                <div className="h-3 w-1/2 rounded bg-ink-200 dark:bg-ink-800" />
                <div className="h-3 w-3/4 rounded bg-pulse-200 dark:bg-pulse-900" />
                <div className="h-3 w-2/5 rounded bg-ink-200 dark:bg-ink-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
