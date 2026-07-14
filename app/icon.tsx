import { ImageResponse } from "next/og";

// Generated app icon (favicon) — a brand-indigo rounded tile with the
// ChatPulse "C" mark. Rendered on demand so we ship no binary asset.
// Edge runtime: next/og embeds its fonts on the edge build, so ImageResponse
// renders reliably on Vercel and in local `next start` (the Node runtime hits a
// font-path resolution bug on Windows).
export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#4f46e5",
        color: "#ffffff",
        fontSize: 22,
        fontWeight: 700,
        borderRadius: 7,
      }}
    >
      C
    </div>,
    { ...size },
  );
}
