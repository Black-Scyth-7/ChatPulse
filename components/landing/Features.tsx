import { FEATURES } from "./content";
import { FeatureIcon } from "./icons";

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 bg-ink-50 py-section-sm md:py-section dark:bg-[#0b1120]"
    >
      <div className="mx-auto max-w-container px-6 md:px-8">
        <div className="mx-auto max-w-content text-center">
          <p className="text-caption font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            Features
          </p>
          <h2 className="mt-3 text-h3 text-ink-900 sm:text-h2 dark:text-ink-100">
            Everything a fast team needs &mdash; nothing it doesn&rsquo;t.
          </h2>
          <p className="mt-4 text-body-lg text-ink-600 dark:text-ink-400">
            Real-time messaging, structured threads, and search that actually
            reaches everything. Built for engineers, encrypted by default.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <article className="h-full rounded-lg border border-ink-200 bg-white p-6 shadow-card dark:border-ink-800 dark:bg-ink-900">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-300">
                  <FeatureIcon name={feature.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-h4 text-ink-900 dark:text-ink-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-body text-ink-600 dark:text-ink-400">
                  {feature.body}
                </p>
                <p className="mt-3 text-small font-medium text-ink-500 dark:text-ink-400">
                  {feature.proof}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
