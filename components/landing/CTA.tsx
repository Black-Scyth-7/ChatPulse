import { WaitlistForm } from "./WaitlistForm";

export function CTA() {
  return (
    <section
      id="waitlist"
      className="scroll-mt-20 bg-white py-section-sm md:py-section dark:bg-ink-950"
    >
      <div className="mx-auto max-w-wide px-6 md:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-brand-600 via-brand-600 to-pulse-600 px-6 py-14 text-center shadow-overlay md:px-16 md:py-20">
          <div className="mx-auto max-w-content">
            <p className="text-caption font-semibold uppercase tracking-wide text-brand-100">
              Get early access
            </p>
            <h2 className="mt-3 text-h3 text-white sm:text-h2">
              Be first in when ChatPulse launches.
            </h2>
            <p className="mt-4 text-body-lg text-brand-100">
              Fast, searchable, end-to-end-encrypted team chat &mdash; built for
              dev teams, startups, and remote-first companies. Join the waitlist
              and we&rsquo;ll email you the moment it opens up.
            </p>
            <WaitlistForm
              variant="inverted"
              idPrefix="cta"
              className="mx-auto mt-8 max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
