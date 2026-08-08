"use server";

import { revalidatePath } from "next/cache";

import { getAdminOrNull } from "../admin";
import type { ActionResult } from "../types";

export type BannerPayload = {
  id?: string;
  image_url: string | null;
  link_url: string | null;
  gradient: string;
  sort_order: number;
  is_active: boolean;
};

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/banners");
}

export async function saveBanner(payload: BannerPayload): Promise<ActionResult> {
  const admin = await getAdminOrNull();
  if (!admin) return { ok: false, error: "Tidak punya akses admin." };

  if (!payload.image_url) return { ok: false, error: "Gambar banner wajib diupload." };

  const row = {
    image_url: payload.image_url,
    link_url: payload.link_url?.trim() || null,
    gradient: payload.gradient,
    sort_order: payload.sort_order,
    is_active: payload.is_active,
  };

  if (payload.id) {
    const { error } = await admin.supabase
      .from("banners")
      .update(row)
      .eq("id", payload.id);
    if (error) return { ok: false, error: error.message };
    revalidateAll();
    return { ok: true, id: payload.id };
  }

  const { data, error } = await admin.supabase
    .from("banners")
    .insert(row)
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true, id: data.id as string };
}

export async function deleteBanner(id: string): Promise<ActionResult> {
  const admin = await getAdminOrNull();
  if (!admin) return { ok: false, error: "Tidak punya akses admin." };

  const { error } = await admin.supabase.from("banners").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true };
}

export async function toggleBannerActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  const admin = await getAdminOrNull();
  if (!admin) return { ok: false, error: "Tidak punya akses admin." };

  const { error } = await admin.supabase
    .from("banners")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidateAll();
  return { ok: true };
}
