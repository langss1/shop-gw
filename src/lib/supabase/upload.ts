import { createClient } from "./client";
import { storagePublicUrl } from "./config";

/**
 * Upload dari browser ke Supabase Storage. Berhasil hanya kalau session
 * user punya role admin — policy storage.objects yang menegakkannya.
 */
export async function uploadFile(bucket: string, folder: string, file: File) {
  const supabase = createClient();

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw new Error(error.message);

  return { path, url: storagePublicUrl(bucket, path) };
}

/** Menghapus object; dipakai saat mengganti gambar. Gagal dihapus tidak fatal. */
export async function removeFile(bucket: string, path: string) {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.warn("[upload] gagal menghapus:", error.message);
}
