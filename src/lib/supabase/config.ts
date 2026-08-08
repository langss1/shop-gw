/**
 * Env Supabase dipakai server maupun browser, jadi harus NEXT_PUBLIC_*.
 * Mendukung penamaan key baru (publishable) maupun lama (anon).
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

/** Konfigurasi lengkap? Dipakai untuk menampilkan pesan setup, bukan crash. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const MEDIA_BUCKET = "app-media";
export const RELEASE_BUCKET = "app-releases";

/** URL publik sebuah object storage. */
export function storagePublicUrl(bucket: string, path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}
