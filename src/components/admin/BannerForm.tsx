"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import ImageUploader from "./ImageUploader";
import { saveBanner } from "@/lib/actions/banners";
import { BANNER_GRADIENTS } from "@/lib/constants";
import type { Banner } from "@/lib/types";

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white";

export default function BannerForm({ banner }: { banner?: Banner }) {
  const router = useRouter();

  const [imageUrl, setImageUrl] = useState<string | null>(banner?.image_url ?? null);
  const [linkUrl, setLinkUrl] = useState(banner?.link_url ?? "");
  const gradient = banner?.gradient ?? BANNER_GRADIENTS[0];
  const [sortOrder, setSortOrder] = useState(String(banner?.sort_order ?? 0));
  const [isActive, setIsActive] = useState(banner?.is_active ?? true);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!imageUrl) {
      setError("Gambar landscape wajib diupload.");
      return;
    }

    setSaving(true);

    const result = await saveBanner({
      id: banner?.id,
      image_url: imageUrl,
      link_url: linkUrl || null,
      gradient,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    });

    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/admin/banners");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Preview seperti tampilan di storefront */}
      <div className="relative w-full h-[180px] rounded-3xl overflow-hidden shadow-sm">
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center text-white/70 text-sm`}>
            Belum ada gambar
          </div>
        )}
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
        <ImageUploader
          label="Gambar landscape"
          value={imageUrl}
          onChange={setImageUrl}
          folder="banners"
          aspect="wide"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Link tujuan
          </label>
          <input
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className={inputClass}
            placeholder="/development"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Urutan
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-slate-700 py-2.5">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            Aktif (tampil di storefront)
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {banner ? "Simpan perubahan" : "Buat banner"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/banners")}
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
