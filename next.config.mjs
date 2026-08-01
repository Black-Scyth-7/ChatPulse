/**
 * Content-Security-Policy.
 *
 * `script-src` keeps `'unsafe-inline'` because the App Router emits inline
 * bootstrap and hydration scripts. Removing it properly means generating a
 * per-request nonce in middleware and threading it through Next — worth doing
 * if this site ever renders untrusted input, and deliberately not done now
 * rather than shipping a nonce setup that silently breaks hydration. The
 * directives that do carry weight here are `object-src 'none'`,
 * `frame-ancestors 'none'`, `base-uri 'self'`, and `form-action 'self'`.
 *
 * `style-src` needs `'unsafe-inline'` for Next's critical CSS.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  // The waitlist posts same-origin; an operator's webhook is called
  // server-side, so the browser never needs a third-party connection.
  "connect-src 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Belt and braces with frame-ancestors, for anything predating CSP support.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Browsers ignore HSTS over plain HTTP, so this is inert on a local dev
  // server and active in production.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Version disclosure is free reconnaissance.
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
