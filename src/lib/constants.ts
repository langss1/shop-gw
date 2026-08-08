import type { AppLinkType, Platform } from "./types";

/** Tab platform di header — sekaligus nilai kolom `apps.platform`. */
export const PLATFORMS: { id: Platform; label: string }[] = [
  { id: "mobile", label: "Mobile" },
  { id: "web", label: "Web" },
  { id: "cli", label: "CLI" },
  { id: "skills-ai", label: "Skills-AI" },
];

/** Pilihan kategori di form admin. */
export const CATEGORIES = [
  "AI & Big Data",
  "Cybersecurity",
  "Web Development",
  "Mobile Development",
  "Productivity",
  "Developer Tools",
] as const;

export const LINK_TYPES: { id: AppLinkType; label: string }[] = [
  { id: "github", label: "GitHub" },
  { id: "launch", label: "Live Demo" },
  { id: "npm", label: "npm" },
  { id: "docs", label: "Docs" },
  { id: "website", label: "Website" },
];

/** Gradient ikon/banner — nilainya class Tailwind, dipakai `bg-gradient-to-br`. */
export const GRADIENTS = [
  "from-blue-500 to-cyan-400",
  "from-indigo-600 to-purple-500",
  "from-emerald-400 to-teal-500",
  "from-orange-500 to-amber-400",
  "from-rose-500 to-pink-500",
  "from-slate-700 to-slate-900",
] as const;

export const BANNER_GRADIENTS = [
  "from-blue-600 via-indigo-600 to-purple-700",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-orange-500 via-rose-500 to-pink-600",
  "from-slate-700 via-slate-800 to-slate-900",
] as const;

export const CONTENT_RATINGS = ["3+", "7+", "12+", "16+", "18+"] as const;

/**
 * Mengubah berbagai bentuk URL YouTube jadi URL embed.
 * Menerima watch?v=, youtu.be/, /embed/, atau ID mentah.
 */
export function youtubeEmbedUrl(input: string | null | undefined, autoplay = false): string | null {
  if (!input) return null;

  const raw = input.trim();
  let id: string | null = null;

  if (/^[\w-]{11}$/.test(raw)) {
    id = raw;
  } else {
    try {
      const url = new URL(raw);
      if (url.hostname.includes("youtu.be")) {
        id = url.pathname.slice(1);
      } else if (url.pathname.startsWith("/embed/")) {
        id = url.pathname.replace("/embed/", "");
      } else {
        id = url.searchParams.get("v");
      }
    } catch {
      return null;
    }
  }

  if (!id) return null;
  const autoPlayParam = autoplay ? "1" : "0";
  return `https://www.youtube.com/embed/${id}?autoplay=${autoPlayParam}&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
}

/** "12.4 MB" untuk ditampilkan di panel detail. */
export function formatBytes(bytes: number | null | undefined): string | null {
  if (!bytes || bytes <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

/** Slug dari nama app, dipakai form admin. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
