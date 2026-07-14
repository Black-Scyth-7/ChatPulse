import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  // Brand icon + social card are pre-rendered static assets in public/ (see
  // that dir). They were previously generated on the fly via next/og edge
  // routes, but that emits a build warning and can't be prerendered on the Node
  // runtime; static assets keep the build clean and are served straight from CDN.
  icons: { icon: "/icon.png" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    title: siteConfig.tagline,
    description: siteConfig.ogDescription,
    images: [
      { url: "/opengraph-image.png", width: 1200, height: 630, alt: siteConfig.tagline },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitter,
    creator: siteConfig.twitter,
    title: siteConfig.tagline,
    description: siteConfig.ogDescription,
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  // The site renders light-only at runtime (Tailwind `dark:` variants exist but
  // nothing toggles the `.dark` class yet). Declaring `light` keeps user-agent
  // dark-mode heuristics (auto-dark, dark default link colors) from recoloring
  // the page. Revisit to `light dark` when a real theme toggle ships.
  colorScheme: "light",
};

/**
 * Site-wide structured data: the Organization (for a knowledge panel /
 * brand identity) and the WebSite (enables the sitelinks search box hint).
 * Page-specific schema (e.g. BlogPosting) is added on the relevant route.
 */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  logo: absoluteUrl("/icon.png"),
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
      </head>
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
