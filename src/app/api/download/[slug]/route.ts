import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { RELEASE_BUCKET, storagePublicUrl } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/**
 * GET /api/download/[slug]
 * Menaikkan download_count lalu mengarahkan ke file rilis (Storage)
 * atau ke URL eksternal yang diisi admin.
 */
export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const supabase = await createClient();

  const { data: app, error } = await supabase
    .from("apps")
    .select("slug, download_url, download_file_path")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !app) {
    return NextResponse.json({ error: "App tidak ditemukan" }, { status: 404 });
  }

  const target = app.download_file_path
    ? storagePublicUrl(RELEASE_BUCKET, app.download_file_path)
    : app.download_url;

  if (!target) {
    return NextResponse.json(
      { error: "App ini belum punya file atau link download" },
      { status: 404 },
    );
  }

  // Gagal menghitung tidak boleh membatalkan download.
  const { error: rpcError } = await supabase.rpc("increment_download", {
    app_slug: slug,
  });
  if (rpcError) console.error("[download] increment_download:", rpcError.message);

  return NextResponse.redirect(new URL(target, request.url));
}
