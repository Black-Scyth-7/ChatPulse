import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * Web app manifest (/manifest.webmanifest). Gives the site an installable
 * identity and lets Lighthouse/browsers pick up name, colors, and icon.
 * The icon is the static asset public/icon.png.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}
