import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://chatpulse.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ChatPulse — Secure real-time team chat",
    template: "%s — ChatPulse",
  },
  description:
    "Secure, real-time team chat for engineering teams. Channels, threads, and instant search — with end-to-end encryption on by default.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ChatPulse",
    title: "Team chat that's fast, searchable, and encrypted end to end.",
    description:
      "Real-time messaging, threads, channels, and full-text search — all end-to-end encrypted. Built for how engineering teams actually work.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team chat that's fast, searchable, and encrypted end to end.",
    description:
      "Real-time messaging, threads, channels, and full-text search — all end-to-end encrypted. Built for how engineering teams actually work.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans antialiased dark:bg-ink-950">
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded focus-visible:bg-brand-600 focus-visible:px-4 focus-visible:py-2 focus-visible:text-small focus-visible:font-semibold focus-visible:text-white focus-visible:shadow-overlay"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
