import { redirect } from "next/navigation";

import { createClient } from "./supabase/server";
import type { Profile } from "./types";

/**
 * Memastikan pengunjung adalah admin. Dipakai layout /admin dan semua
 * Server Action. RLS di database tetap jadi penjaga terakhir.
 */
export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile as Profile).role !== "admin") {
    redirect("/admin/login?error=forbidden");
  }

  return { supabase, user, profile: profile as Profile };
}

/** Versi non-redirect, untuk Server Action yang ingin mengembalikan error. */
export async function getAdminOrNull() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || (profile as Profile).role !== "admin") return null;

  return { supabase, user, profile: profile as Profile };
}
