import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/config";
import type { AppWithRelations, Banner, Platform } from "./types";

const APP_SELECT = "*, app_screenshots(*), app_links(*)";

function sortRelations(app: AppWithRelations): AppWithRelations {
  return {
    ...app,
    app_screenshots: [...(app.app_screenshots ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
    app_links: [...(app.app_links ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

/** App published untuk storefront, sudah terurut. */
export async function getPublishedApps(filters?: {
  platform?: Platform;
  category?: string;
}): Promise<AppWithRelations[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  let query = supabase
    .from("apps")
    .select(APP_SELECT)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (filters?.platform) query = query.eq("platform", filters.platform);
  if (filters?.category) query = query.eq("category", filters.category);

  const { data, error } = await query;
  if (error) {
    console.error("[queries] getPublishedApps:", error.message);
    return [];
  }

  return (data as AppWithRelations[]).map(sortRelations);
}

export async function getAppBySlug(slug: string): Promise<AppWithRelations | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("apps")
    .select(APP_SELECT)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[queries] getAppBySlug:", error.message);
    return null;
  }
  if (!data) return null;

  return sortRelations(data as AppWithRelations);
}

/** Banner aktif untuk carousel di header. */
export async function getActiveBanners(): Promise<Banner[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[queries] getActiveBanners:", error.message);
    return [];
  }

  return data as Banner[];
}
