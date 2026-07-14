"use client";

import { useEffect, useId, useRef, useState } from "react";
import { WAITLIST_COPY } from "./content";
import { SpinnerIcon } from "./icons";

type Status = "idle" | "submitting" | "success" | "error";

type Variant = "default" | "inverted";

// Pragmatic RFC-5322-lite check — enough to catch obvious typos client-side;
// the server route validates authoritatively.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface WaitlistFormProps {
  /** "inverted" is for the brand-gradient CTA band (white field, inverted button). */
  variant?: Variant;
  /** Distinguishes the two form instances (hero + CTA) for stable element ids. */
  idPrefix: string;
  className?: string;
}

export function WaitlistForm({
  variant = "default",
  idPrefix,
  className = "",
}: WaitlistFormProps) {
  const reactId = useId();
  const fieldId = `${idPrefix}-email-${reactId}`;
  const msgId = `${idPrefix}-msg-${reactId}`;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  const inverted = variant === "inverted";
  const submitting = status === "submitting";

  // On success the form is replaced by the confirmation, so keyboard focus
  // would otherwise fall back to <body>. Move it to the confirmation (which is
  // also a live region) so screen-reader and keyboard users land on the result.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setError(WAITLIST_COPY.errorInvalid);
      // Return focus to the field so the user can immediately correct it.
      inputRef.current?.focus();
      return;
    }

    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });

      if (res.ok) {
        setStatus("success");
        return;
      }
      if (res.status === 409) {
        setStatus("error");
        setError(WAITLIST_COPY.errorDuplicate);
        return;
      }
      if (res.status === 400) {
        setStatus("error");
        setError(WAITLIST_COPY.errorInvalid);
        return;
      }
      throw new Error(`Unexpected status ${res.status}`);
    } catch {
      setStatus("error");
      setError(WAITLIST_COPY.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <p
        ref={successRef}
        role="status"
        tabIndex={-1}
        className={
          inverted
            ? "rounded-md bg-white/95 px-4 py-3 text-small font-medium text-success-fg focus:outline-none"
            : "rounded-md bg-success-soft px-4 py-3 text-small font-medium text-success-fg focus:outline-none"
        }
      >
        {WAITLIST_COPY.success}
      </p>
    );
  }

  const fieldClasses = inverted
    ? "h-12 w-full rounded-md border border-transparent bg-white px-3.5 text-body text-ink-900 placeholder:text-ink-400 transition focus:outline-none focus:ring-2 focus:ring-white/60"
    : "h-12 w-full rounded-md border border-ink-300 bg-white px-3.5 text-body text-ink-900 placeholder:text-ink-400 transition focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30 disabled:bg-ink-50 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100";

  const buttonClasses = inverted
    ? "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded px-6 text-body font-semibold text-brand-700 shadow-xs transition-colors bg-white hover:bg-brand-50 active:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600 disabled:opacity-60 disabled:pointer-events-none"
    : "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded px-6 text-body font-semibold text-white shadow-xs transition-colors bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none";

  const hasError = status === "error";

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={fieldId} className="sr-only">
          {WAITLIST_COPY.emailLabel}
        </label>
        <input
          ref={inputRef}
          id={fieldId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder={WAITLIST_COPY.emailPlaceholder}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") {
              setStatus("idle");
              setError(null);
            }
          }}
          disabled={submitting}
          aria-invalid={hasError}
          aria-describedby={msgId}
          className={`flex-1 ${hasError ? "!border-danger" : ""} ${fieldClasses}`}
        />
        <button type="submit" disabled={submitting} className={buttonClasses}>
          {submitting && <SpinnerIcon className="h-4 w-4" />}
          {submitting ? WAITLIST_COPY.submitting : WAITLIST_COPY.submit}
        </button>
      </div>
      <p
        id={msgId}
        // Announce validation/API errors to assistive tech the moment they
        // appear. The node persists (helper ⇄ error) so the role swap is read.
        role={hasError ? "alert" : undefined}
        className={
          hasError
            ? "mt-3 flex items-center gap-1.5 text-small font-medium text-danger"
            : inverted
              ? "mt-3 text-small text-brand-100"
              : "mt-3 text-small text-ink-500 dark:text-ink-400"
        }
      >
        {hasError ? (
          <>
            <span aria-hidden>⚠</span>
            {error}
          </>
        ) : (
          WAITLIST_COPY.helper
        )}
      </p>
    </form>
  );
}
