import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";

/**
 * ChatPulse Design System — Tailwind theme extension.
 *
 * This file EXTENDS the default Tailwind theme (it does not replace it), so
 * every stock utility (e.g. `text-gray-500`, `p-4`) keeps working while the
 * tokens below add the ChatPulse brand layer. See /docs/design-system.md for
 * the full specification and usage guidance.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand — Primary (Indigo). The core action / link color.
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1", // base
          600: "#4f46e5", // default button / focus ring
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
          DEFAULT: "#4f46e5",
        },
        // Secondary — "Pulse" teal. Supporting UI, gradients, data accents.
        pulse: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4", // base
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
          DEFAULT: "#06b6d4",
        },
        // Accent — Violet. Highlights, badges, decorative emphasis only.
        accent: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7", // base
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
          DEFAULT: "#a855f7",
        },
        // Neutral grays — cool-tinted slate for text, borders, surfaces.
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
          DEFAULT: "#0f172a",
        },
        // Semantic colors — one accessible base per intent (+ soft bg).
        success: {
          DEFAULT: "#16a34a",
          soft: "#dcfce7",
          fg: "#14532d",
        },
        warning: {
          DEFAULT: "#d97706",
          soft: "#fef3c7",
          fg: "#78350f",
        },
        danger: {
          DEFAULT: "#dc2626",
          soft: "#fee2e2",
          fg: "#7f1d1d",
        },
        info: {
          DEFAULT: "#0284c7",
          soft: "#e0f2fe",
          fg: "#075985",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        // Typography scale — [size, { lineHeight, letterSpacing, weight }].
        h1: [
          "3.5rem",
          { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h2: [
          "2.5rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h3: [
          "1.75rem",
          { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        h4: [
          "1.25rem",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
      },
      spacing: {
        // 8px grid (with a 4px half-step). Numeric keys are px-named tokens.
        "0.5": "0.25rem", // 4px  — hairline / icon gap
        "18": "4.5rem", // 72px  — large component rhythm
        "22": "5.5rem", // 88px
        section: "6rem", // 96px — vertical section padding (desktop)
        "section-sm": "4rem", // 64px — vertical section padding (mobile)
      },
      borderRadius: {
        none: "0",
        sm: "0.25rem", // 4px  — inputs, small chips
        DEFAULT: "0.5rem", // 8px  — buttons, badges
        md: "0.625rem", // 10px
        lg: "0.75rem", // 12px — cards
        xl: "1rem", // 16px — feature cards, media
        "2xl": "1.5rem", // 24px — hero / large surfaces
        full: "9999px", // pills, avatars
      },
      maxWidth: {
        // Section container widths.
        prose: "42rem", // 672px — blog / long-form reading measure
        content: "48rem", // 768px — narrow marketing content
        container: "72rem", // 1152px — standard section container
        wide: "80rem", // 1280px — full-width hero / feature grids
      },
      boxShadow: {
        // Soft, layered elevation tuned for light surfaces.
        xs: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
        card: "0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
        "card-hover":
          "0 10px 24px -6px rgb(15 23 42 / 0.12), 0 4px 8px -4px rgb(15 23 42 / 0.08)",
        overlay: "0 20px 40px -12px rgb(15 23 42 / 0.22)",
        // Brand-tinted focus glow for interactive emphasis.
        glow: "0 0 0 4px rgb(99 102 241 / 0.18)",
      },
      ringColor: {
        DEFAULT: "#4f46e5",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [typography],
};

export default config;
