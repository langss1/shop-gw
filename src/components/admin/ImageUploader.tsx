"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { uploadFile } from "@/lib/supabase/upload";
import { MEDIA_BUCKET } from "@/lib/supabase/config";

export default function ImageUploader({
  value,
  onChange,
  folder,
  label,
  aspect = "square",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  label?: string;
  aspect?: "square" | "video" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const box =
    aspect === "square"
      ? "w-24 h-24"
      : aspect === "video"
        ? "w-40 h-[90px]"
        : "w-full h-32";

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { url } = await uploadFile(MEDIA_BUCKET, folder, file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`${box} rounded-xl border border-dashed border-slate-300 bg-slate-50 relative overflow-hidden shrink-0`}
        >
          {value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(null)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                aria-label="Hapus gambar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="w-full h-full flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ImagePlus className="w-5 h-5" />
              )}
              <span className="text-[10px] font-medium">
                {uploading ? "Upload…" : "Pilih"}
              </span>
            </button>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            {value ? "Ganti gambar" : "Upload gambar"}
          </button>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG, atau WebP.</p>
          {error && <p className="text-xs text-red-600 mt-1 break-words">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
