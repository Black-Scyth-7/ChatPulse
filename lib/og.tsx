import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

/** Standard Open Graph / Twitter card dimensions. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Renders a branded 1200×630 social card. Used by the site-level and
 * per-post `opengraph-image` / `twitter-image` route files so every share
 * card looks consistent. Uses only system-safe layout (no external fonts)
 * so it renders deterministically at build time.
 */
export function renderOgImage({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow?: string;
}): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #0891b2 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            color: "#4f46e5",
            fontSize: 40,
            fontWeight: 700,
            borderRadius: 16,
          }}
        >
          C
        </div>
        <div style={{ fontSize: 34, fontWeight: 700 }}>{siteConfig.name}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: "#a5f3fc",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
      </div>

      <div style={{ fontSize: 26, color: "#c7d2fe" }}>{siteConfig.url}</div>
    </div>,
    { ...ogSize },
  );
}
