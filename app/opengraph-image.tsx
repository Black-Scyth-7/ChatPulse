import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { siteConfig } from "@/lib/site";

// Edge runtime — see app/icon.tsx for why (next/og font resolution).
export const runtime = "edge";
export const alt = siteConfig.tagline;
export const size = ogSize;
export const contentType = ogContentType;

export default function OpengraphImage() {
  return renderOgImage({
    eyebrow: "Real-time · Encrypted",
    title: siteConfig.tagline,
  });
}
