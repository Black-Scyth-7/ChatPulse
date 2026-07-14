import Link from "next/link";
import { FOOTER } from "./content";

export function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-[#0b1120]">
      <div className="mx-auto max-w-container px-6 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-[1.5fr_repeat(2,1fr)]">
          {/* Brand + boilerplate */}
          <div>
            <p className="text-body-lg font-semibold text-ink-900 dark:text-ink-100">
              ChatPulse
            </p>
            <p className="mt-3 max-w-xs text-small text-ink-500 dark:text-ink-400">
              {FOOTER.boilerplate}
            </p>
          </div>

          {/* Link columns */}
          {FOOTER.columns.map((column) => (
            <nav key={column.header} aria-label={column.header}>
              <h2 className="text-caption font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-400">
                {column.header}
              </h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block rounded py-1 text-small text-ink-500 transition-colors hover:text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:text-ink-400 dark:hover:text-ink-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-200 pt-8 sm:flex-row dark:border-ink-800">
          <p className="text-small text-ink-500 dark:text-ink-400">
            {FOOTER.copyright}
          </p>
          <p className="text-small text-ink-500 dark:text-ink-400">
            {FOOTER.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
