"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CTA, NAV_LINKS } from "./content";
import { CloseIcon, MenuIcon } from "./icons";

const primaryBtn =
  "inline-flex items-center justify-center rounded font-semibold text-small text-white bg-brand-600 shadow-xs transition-colors hover:bg-brand-700 active:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2";

export function Nav() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on Escape; lock body scroll while the sheet is open; restore focus.
  useEffect(() => {
    if (!open) return;

    // The toggle button is persistent, so capturing it here is safe and keeps
    // the exhaustive-deps ref-in-cleanup lint rule happy.
    const toggle = toggleRef.current;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      toggle?.focus();
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-ink-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-ink-800 dark:bg-ink-950/80">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full max-w-container items-center justify-between px-6 md:px-8"
      >
        <Link
          href="/"
          className="rounded text-body-lg font-semibold text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:text-ink-100"
        >
          ChatPulse
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex h-9 items-center rounded px-3 text-small font-medium text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-ink-100"
            >
              {link.label}
            </Link>
          ))}
          <Link href="#waitlist" className={`ml-2 h-10 px-4 ${primaryBtn}`}>
            {CTA.waitlist}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-700 transition-colors hover:bg-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 md:hidden dark:text-ink-300 dark:hover:bg-ink-800"
        >
          {open ? (
            <CloseIcon className="h-5 w-5" />
          ) : (
            <MenuIcon className="h-5 w-5" />
          )}
        </button>
      </nav>

      {/* Mobile sheet */}
      {open && (
        <>
          <div
            className="fixed inset-0 top-16 z-30 bg-ink-900/20 md:hidden"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav"
            className="absolute inset-x-0 top-16 z-40 border-b border-ink-200 bg-white p-6 md:hidden dark:border-ink-800 dark:bg-ink-950"
          >
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center rounded text-body text-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 dark:text-ink-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="#waitlist"
              onClick={() => setOpen(false)}
              className={`mt-4 h-12 w-full px-4 text-body ${primaryBtn}`}
            >
              {CTA.waitlist}
            </Link>
          </div>
        </>
      )}
    </header>
  );
}
