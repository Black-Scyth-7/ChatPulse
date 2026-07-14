/**
 * Single source of drop-in landing copy (CHA-8, docs/landing-copy.md) and the
 * data-driven section content. Strings live here so components stay consistent
 * and the copy stays traceable to the messaging framework (CHA-7).
 */

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Security", href: "#security" },
  { label: "Blog", href: "/blog" },
] as const;

export const CTA = {
  waitlist: "Join the waitlist",
  earlyAccess: "Get early access",
  seeHow: "See how it works",
  readBlog: "Read the blog",
} as const;

export const WAITLIST_COPY = {
  emailLabel: "Work email",
  emailPlaceholder: "you@company.com",
  submit: CTA.waitlist,
  submitting: "Joining…",
  helper: "Be first in when we launch. No spam, unsubscribe anytime.",
  success:
    "You're on the list. We'll email you the moment ChatPulse opens up.",
  errorInvalid: "Enter a valid email address.",
  errorDuplicate: "You're already on the list — check your inbox.",
  errorGeneric: "Something went wrong. Try again in a moment.",
} as const;

export type IconName =
  | "bolt"
  | "lock"
  | "threads"
  | "search"
  | "paperclip"
  | "plug";

export interface Feature {
  icon: IconName;
  title: string;
  body: string;
  proof: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "bolt",
    title: "Move at the speed of the conversation",
    body: "Real-time messaging means messages land the instant they're sent — so standups, incidents, and quick decisions happen live, with no refresh and no lag.",
    proof: "Sub-second delivery.",
  },
  {
    icon: "lock",
    title: "Private by default, not by upgrade",
    body: "Every message is end-to-end encrypted from message one. Sensitive work stays between the people in the room — encryption is the baseline, never a paid tier.",
    proof: "Encrypted end to end.",
  },
  {
    icon: "threads",
    title: "Keep the signal, lose the noise",
    body: "Threads spin detailed discussion out of the main flow; channels keep teams, projects, and topics cleanly separated. Structure, not chaos.",
    proof: "Threads and channels.",
  },
  {
    icon: "search",
    title: "Find any decision in seconds",
    body: "Full-text search reaches every message, thread, and file. Answers are a query away instead of a scroll away.",
    proof: "Search everything, instantly.",
  },
  {
    icon: "paperclip",
    title: "Share the work, not just the link",
    body: "Drag in designs, logs, and docs. Files live alongside the conversation that produced them, so context never gets lost.",
    proof: "Files where the work is.",
  },
  {
    icon: "plug",
    title: "Wire ChatPulse into your stack",
    body: "Integrations bring deploys, alerts, and tickets into the channels where your team already works.",
    proof: "Your tools, where the work happens.",
  },
];

export interface Audience {
  title: string;
  body: string;
}

export const AUDIENCES: Audience[] = [
  {
    title: "Dev teams",
    body: "Chat that respects how engineers work — keyboard-fast, low-noise, and searchable. Real-time for incidents, threads for the deep dives.",
  },
  {
    title: "Startups",
    body: "Enterprise-grade privacy without the enterprise setup. Get running in minutes with security you don't have to configure.",
  },
  {
    title: "Remote-first companies",
    body: "When chat is your office, it should be private and findable. Threads, channels, and search keep a distributed team in sync across time zones.",
  },
];

export interface SecurityPoint {
  label: string;
  body: string;
}

export const SECURITY_POINTS: SecurityPoint[] = [
  {
    label: "Encrypted end to end",
    body: "Messages and files are encrypted on your devices and stay that way in transit and at rest. Only the people in the conversation hold the keys.",
  },
  {
    label: "On by default, not by upgrade",
    body: "No plan to pick, no toggle to find. Encryption is the baseline for every message, in every channel, from day one.",
  },
  {
    label: "Your data stays yours",
    body: "Your conversations and search index belong to your team — not to an ad model and not to us.",
  },
];

export const FOOTER = {
  boilerplate:
    "ChatPulse is real-time team chat for engineering teams, startups, and remote-first companies. Channels, threads, file sharing, and instant full-text search — all with end-to-end encryption on by default. Fast, clean, and built to stay out of your way.",
  tagline: "Fast, searchable, private team chat.",
  copyright: "© 2026 ChatPulse. All rights reserved.",
  columns: [
    {
      header: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Security", href: "#security" },
        { label: "Join the waitlist", href: "#waitlist" },
      ],
    },
    {
      header: "Company",
      links: [{ label: "Blog", href: "/blog" }],
    },
  ],
} as const;
