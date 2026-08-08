"use server";

import { revalidatePath } from "next/cache";

import { getAdminOrNull } from "../admin";
import { slugify } from "../constants";
import type { ActionResult, AppLinkType, AppStatus, Platform } from "../types";

export type AppPayload = {
  id?: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
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
  status: AppStatus;
  is_featured: boolean;
  sort_order: number;
  screenshots: { image_url: string; caption: string | null }[];
  links: { type: AppLinkType; url: string; label: string | null }[];
};

function validate(payload: AppPayload): string | null {
  if (!payload.name.trim()) return "Nama app wajib diisi.";
  if (!payload.slug.trim()) return "Slug wajib diisi.";
  if (!/^[a-z0-9-]+$/.test(payload.slug)) {
    return "Slug hanya boleh huruf kecil, angka, dan tanda hubung.";
  }
  if (payload.developer.length > 5) return "Developer maksimal 5 orang.";
  if (payload.rating < 0 || payload.rating > 5) return "Rating harus antara 0 dan 5.";
  if (
    payload.status === "published" &&
    !payload.download_url &&
    !payload.download_file_path
  ) {
    return "App yang di-publish harus punya file rilis atau URL download.";
  }
  return null;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/apps");
}

/** Create atau update satu app beserta screenshot dan link-nya. */
export async function saveApp(payload: AppPayload): Promise<ActionResult> {
  const admin = await getAdminOrNull();
  if (!admin) return { ok: false, error: "Tidak punya akses admin." };

  const error = validate(payload);
  if (error) return { ok: false, error };

  const { supabase } = admin;

  const row = {
    slug: slugify(payload.slug),
    name: payload.name.trim(),
    tagline: payload.tagline.trim() || null,
    description: payload.description.trim() || null,
    category: payload.category,
    platform: payload.platform,
    year: payload.year,
    tech_stack: payload.tech_stack,
    icon_url: payload.icon_url,
    gradient: payload.gradient,
    video_url: payload.video_url?.trim() || null,
    rating: payload.rating,
    content_rating: payload.content_rating,
    has_iap: payload.has_iap,
    developer: payload.developer.length > 0 ? payload.developer : ["Gilang Store"],
    version: payload.version?.trim() || null,
    download_url: payload.download_url?.trim() || null,
    download_file_path: payload.download_file_path,
    download_size_bytes: payload.download_size_bytes,
    status: payload.status,
    is_featured: payload.is_featured,
    sort_order: payload.sort_order,
  };

  let appId = payload.id;

  if (appId) {
    const { error: updateError } = await supabase
      .from("apps")
      .update(row)
      .eq("id", appId);
    if (updateError) {
      if (updateError.code === "23505") {
        return { ok: false, error: "Sudah ada app lain dengan nama yang sama." };
      }
      return { ok: false, error: updateError.message };
    }
  } else {
    const { data, error: insertError } = await supabase
      .from("apps")
      .insert(row)
      .select("id")
      .single();
    if (insertError) {
      if (insertError.code === "23505") {
        return { ok: false, error: "Sudah ada app lain dengan nama yang sama." };
      }
      return { ok: false, error: insertError.message };
    }
    appId = data.id as string;
  }

  // Screenshot & link disinkronkan dengan replace: jumlahnya kecil dan
  // urutannya ditentukan penuh oleh form.
  await supabase.from("app_screenshots").delete().eq("app_id", appId);
  if (payload.screenshots.length > 0) {
    const { error: shotError } = await supabase.from("app_screenshots").insert(
      payload.screenshots.map((shot, i) => ({
        app_id: appId,
        image_url: shot.image_url,
        caption: shot.caption,
        sort_order: i + 1,
      })),
    );
    if (shotError) return { ok: false, error: shotError.message };
  }

  await supabase.from("app_links").delete().eq("app_id", appId);
  const validLinks = payload.links.filter((link) => link.url.trim());
  if (validLinks.length > 0) {
    const { error: linkError } = await supabase.from("app_links").insert(
      validLinks.map((link, i) => ({
        app_id: appId,
        type: link.type,
        url: link.url.trim(),
        label: link.label?.trim() || null,
        sort_order: i + 1,
      })),
    );
    if (linkError) return { ok: false, error: linkError.message };
  }

  revalidateAll();
  return { ok: true, id: appId };
}

export async function deleteApp(id: string): Promise<ActionResult> {
  const admin = await getAdminOrNull();
  if (!admin) return { ok: false, error: "Tidak punya akses admin." };

  const { error } = await admin.supabase.from("apps").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true };
}

/** Toggle cepat draft <-> published dari halaman daftar. */
export async function toggleAppStatus(
  id: string,
  status: AppStatus,
): Promise<ActionResult> {
  const admin = await getAdminOrNull();
  if (!admin) return { ok: false, error: "Tidak punya akses admin." };

  const { error } = await admin.supabase.from("apps").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true };
}
