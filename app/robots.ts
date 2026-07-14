import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Generates /robots.txt. Allows full crawling and points bots at the sitemap.
 * The API route is disallowed since it holds no indexable content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
