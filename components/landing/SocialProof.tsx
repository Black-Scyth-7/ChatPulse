import Link from "next/link";
import { AUDIENCES, CTA } from "./content";

export function SocialProof() {
  return (
    <section className="bg-white py-section-sm md:py-section dark:bg-ink-950">
      <div className="mx-auto max-w-container px-6 md:px-8">
        <div className="mx-auto max-w-content text-center">
          <p className="text-caption font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            Who it&rsquo;s for
          </p>
          <h2 className="mt-3 text-h3 text-ink-900 sm:text-h2 dark:text-ink-100">
            Built for teams that live in chat.
          </h2>
          <p className="mt-4 text-body-lg text-ink-600 dark:text-ink-400">
            ChatPulse is for teams where chat is where the work actually happens
            &mdash; fast, technical, and distributed.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:mt-16 md:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <li key={audience.title}>
              <article className="h-full rounded-lg border border-ink-200 bg-white p-6 shadow-card dark:border-ink-800 dark:bg-ink-900">
                <h3 className="text-h4 text-ink-900 dark:text-ink-100">
                  {audience.title}
                </h3>
                <p className="mt-2 text-body text-ink-600 dark:text-ink-400">
                  {audience.body}
                </p>
              </article>
            </li>
          ))}
        </ul>

        {/* Founding-user callout — honest pre-launch proof (no fabricated metrics) */}
        <div className="mx-auto mt-12 max-w-content rounded-xl border border-brand-200 bg-brand-50 p-6 text-center md:p-8 dark:border-brand-800 dark:bg-brand-950/30">
          <p className="text-body-lg font-semibold text-ink-900 dark:text-ink-100">
            Join the founding teams shaping ChatPulse.
          </p>
          <p className="mt-2 text-body text-ink-600 dark:text-ink-400">
            Early users get direct input on the roadmap and first access at
            launch.
          </p>
          <Link
            href="#waitlist"
            className="mt-5 inline-flex h-10 items-center justify-center rounded bg-brand-600 px-4 text-small font-semibold text-white shadow-xs transition-colors hover:bg-brand-700 active:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
          >
            {CTA.earlyAccess}
          </Link>
        </div>
      </div>
    </section>
  );
}
