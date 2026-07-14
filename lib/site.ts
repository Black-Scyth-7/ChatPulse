/**
 * Single source of truth for site-wide identity used by SEO surfaces:
 * metadata, sitemap, robots, Open Graph / Twitter cards, and JSON-LD
 * structured data. Keeping these here means the canonical URL, name, and
 * social handles are declared once and reused everywhere.
 */
export const siteConfig = {
  name: "ChatPulse",
  // Canonical origin. Overridable via NEXT_PUBLIC_SITE_URL (inlined at build
  // time) so preview/custom domains render correct absolute URLs without a code
  // change; defaults to the production domain.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://chatpulse.app",
  title: "ChatPulse — Secure real-time team chat",
  description:
    "Secure, real-time team chat for engineering teams. Channels, threads, and instant search — with end-to-end encryption on by default.",
  tagline: "Team chat that's fast, searchable, and encrypted end to end.",
  ogDescription:
    "Real-time messaging, threads, channels, and full-text search — all end-to-end encrypted. Built for how engineering teams actually work.",
  twitter: "@chatpulse",
  locale: "en_US",
} as const;

/** Absolute URL for a site-relative path (e.g. `/blog` → `https://…/blog`). */
export function absoluteUrl(path: string = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, siteConfig.url).toString();
}
