export type AppStatus = "draft" | "published";
export type Platform = "mobile" | "web" | "cli" | "skills-ai";
export type AppLinkType = "github" | "launch" | "npm" | "docs" | "website";

export type App = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string;
  platform: Platform;
  year: number | null;
  tech_stack: string[];
  icon_url: string | null;
  gradient: string;
  video_url: string | null;
  rating: number;
  content_rating: string;
  has_iap: boolean;
  developer: string[];
  version: string | null;
  download_url: string | null;
  download_file_path: string | null;
  download_size_bytes: number | null;
  download_count: number;
  status: AppStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type AppScreenshot = {
  id: string;
  app_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export type AppLink = {
  id: string;
  app_id: string;
  type: AppLinkType;
  url: string;
  label: string | null;
  sort_order: number;
};

export type AppWithRelations = App & {
  app_screenshots: AppScreenshot[];
  app_links: AppLink[];
};

export type Banner = {
  id: string;
  image_url: string | null;
  link_url: string | null;
  gradient: string;
  sort_order: number;
  is_active: boolean;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: "admin" | "viewer";
};

/** Hasil Server Action untuk form admin. */
export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };
