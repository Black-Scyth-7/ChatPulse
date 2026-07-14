import Link from "next/link";
import { CTA, SECURITY_POINTS } from "./content";
import { ShieldCheckIcon } from "./icons";

export function Security() {
  return (
    <section
      id="security"
      className="scroll-mt-20 bg-ink-50 py-section-sm md:py-section dark:bg-[#0b1120]"
    >
      <div className="mx-auto max-w-container px-6 md:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-content">
            <p className="text-caption font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
              Security
            </p>
            <h2 className="mt-3 text-h3 text-ink-900 sm:text-h2 dark:text-ink-100">
              Private by default &mdash; even we can&rsquo;t read your messages.
            </h2>
            <p className="mt-4 text-body-lg text-ink-600 dark:text-ink-400">
              End-to-end encryption is on from message one, not buried behind a
              compliance tier. Your conversations, files, and search index stay
              yours &mdash; encrypted in transit and at rest, decrypted only on
              the devices in the conversation.
            </p>
            <Link
              href="#waitlist"
              className="mt-6 inline-flex items-center rounded text-small font-medium text-brand-700 underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:text-brand-300"
            >
              {CTA.waitlist} &rarr;
            </Link>
          </div>

          <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-card md:p-8 dark:border-ink-800 dark:bg-ink-900">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-pulse-50 text-pulse-700 dark:bg-pulse-950/40 dark:text-pulse-300">
              <ShieldCheckIcon className="h-6 w-6" />
            </span>
            <dl className="mt-6 space-y-6">
              {SECURITY_POINTS.map((point) => (
                <div key={point.label}>
                  <dt className="text-h4 text-ink-900 dark:text-ink-100">
                    {point.label}
                  </dt>
                  <dd className="mt-1 text-body text-ink-600 dark:text-ink-400">
                    {point.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
