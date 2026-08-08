"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2, Upload, X } from "lucide-react";

import ImageUploader from "./ImageUploader";
import { saveApp, type AppPayload } from "@/lib/actions/apps";
import { uploadFile } from "@/lib/supabase/upload";
import { RELEASE_BUCKET } from "@/lib/supabase/config";
import {
  CATEGORIES,
  CONTENT_RATINGS,
  GRADIENTS,
  LINK_TYPES,
  PLATFORMS,
  formatBytes,
  slugify,
} from "@/lib/constants";
import type { AppLinkType, AppStatus, AppWithRelations, Platform } from "@/lib/types";

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
      <h2 className="font-bold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

type ScreenshotRow = { key: string; image_url: string; caption: string };
type LinkRow = { key: string; type: AppLinkType; url: string; label: string };

export default function AppForm({ app }: { app?: AppWithRelations }) {
  const router = useRouter();
  const releaseInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(app?.name ?? "");
  const [slug, setSlug] = useState(app?.slug ?? "");
  // Slug field is hidden from the UI — for new apps it always tracks the
  // name; for existing apps it stays fixed so renaming doesn't break the
  // download URL (/api/download/<slug>).
  const slugTouched = Boolean(app);
  const [tagline, setTagline] = useState(app?.tagline ?? "");
  const [description, setDescription] = useState(app?.description ?? "");
  const [category, setCategory] = useState<string>(app?.category ?? CATEGORIES[0]);
  const [platform, setPlatform] = useState<Platform>(app?.platform ?? "mobile");
  const [year, setYear] = useState(app?.year ? String(app.year) : "");
  const [techStack, setTechStack] = useState<string[]>(app?.tech_stack ?? []);
  const [techInput, setTechInput] = useState("");
  const [iconUrl, setIconUrl] = useState<string | null>(app?.icon_url ?? null);
  const [gradient, setGradient] = useState(app?.gradient ?? GRADIENTS[0]);
  const [videoUrl, setVideoUrl] = useState(app?.video_url ?? "");
  const [rating, setRating] = useState(String(app?.rating ?? 4.5));
  const [contentRating, setContentRating] = useState(app?.content_rating ?? "12+");
  const [hasIap, setHasIap] = useState(app?.has_iap ?? false);
  const [developers, setDevelopers] = useState<string[]>(
    app?.developer ?? ["Gilang Store"],
  );
  const [developerInput, setDeveloperInput] = useState("");
  const [version, setVersion] = useState(app?.version ?? "");

  const [downloadUrl, setDownloadUrl] = useState(app?.download_url ?? "");
  const [releasePath, setReleasePath] = useState<string | null>(
    app?.download_file_path ?? null,
  );
  const [releaseSize, setReleaseSize] = useState<number | null>(
    app?.download_size_bytes ?? null,
  );
  const [uploadingRelease, setUploadingRelease] = useState(false);

  const [status, setStatus] = useState<AppStatus>(app?.status ?? "draft");
  const [isFeatured, setIsFeatured] = useState(app?.is_featured ?? false);
  const [sortOrder, setSortOrder] = useState(String(app?.sort_order ?? 0));

  const [screenshots, setScreenshots] = useState<ScreenshotRow[]>(
    app?.app_screenshots.map((shot) => ({
      key: shot.id,
      image_url: shot.image_url,
      caption: shot.caption ?? "",
    })) ?? [],
  );
  const [links, setLinks] = useState<LinkRow[]>(
    app?.app_links.map((link) => ({
      key: link.id,
      type: link.type,
      url: link.url,
      label: link.label ?? "",
    })) ?? [],
  );

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function addTech() {
    const value = techInput.trim();
    if (!value || techStack.includes(value)) return;
    setTechStack([...techStack, value]);
    setTechInput("");
  }

  function addDeveloper() {
    const value = developerInput.trim();
    if (!value || developers.includes(value) || developers.length >= 5) return;
    setDevelopers([...developers, value]);
    setDeveloperInput("");
  }

  function moveScreenshot(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= screenshots.length) return;
    const next = [...screenshots];
    [next[index], next[target]] = [next[target], next[index]];
    setScreenshots(next);
  }

  async function handleReleaseFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setUploadingRelease(true);
    try {
      const { path } = await uploadFile(RELEASE_BUCKET, "releases", file);
      setReleasePath(path);
      setReleaseSize(file.size);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload file rilis gagal.");
    } finally {
      setUploadingRelease(false);
      if (releaseInputRef.current) releaseInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const payload: AppPayload = {
      id: app?.id,
      slug,
      name,
      tagline,
      description,
      category,
      platform,
      year: year ? Number(year) : null,
      tech_stack: techStack,
      icon_url: iconUrl,
      gradient,
      video_url: videoUrl || null,
      rating: Number(rating) || 0,
      content_rating: contentRating,
      has_iap: hasIap,
      developer: developers,
      version: version || null,
      download_url: downloadUrl || null,
      download_file_path: releasePath,
      download_size_bytes: releaseSize,
      status,
      is_featured: isFeatured,
      sort_order: Number(sortOrder) || 0,
      screenshots: screenshots
        .filter((shot) => shot.image_url)
        .map((shot) => ({ image_url: shot.image_url, caption: shot.caption || null })),
      links: links.map((link) => ({
        type: link.type,
        url: link.url,
        label: link.label || null,
      })),
    };

    const result = await saveApp(payload);

    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    router.push("/admin/apps");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <Card title="Informasi dasar">
        <Field label="Nama app">
          <input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            placeholder="DataFlow Analytics"
          />
        </Field>

        <Field label="Tagline" hint="Teks pendek di bawah nama app pada kartu.">
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className={inputClass}
            placeholder="Analitik data real-time bertenaga AI"
          />
        </Field>

        <Field label="Deskripsi">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={inputClass}
            placeholder="Penjelasan lengkap yang tampil di panel detail…"
          />
        </Field>

        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Kategori">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Platform (tab)">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className={inputClass}
            >
              {PLATFORMS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Tahun">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={inputClass}
              placeholder="2026"
            />
          </Field>
        </div>

        <Field label="Tech stack" hint="Tekan Enter untuk menambah.">
          <div className="flex flex-wrap gap-2 mb-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-sm text-slate-700"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => setTechStack(techStack.filter((t) => t !== tech))}
                  className="text-slate-400 hover:text-red-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            className={inputClass}
            placeholder="Next.js"
          />
        </Field>
      </Card>

      <Card title="Tampilan">
        <div className="grid md:grid-cols-2 gap-4">
          <ImageUploader
            label="Ikon app"
            value={iconUrl}
            onChange={setIconUrl}
            folder="icons"
          />

          <Field label="Gradient" hint="Dipakai kalau ikon belum diupload.">
            <div className="grid grid-cols-3 gap-2">
              {GRADIENTS.map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setGradient(item)}
                  className={`h-10 rounded-xl bg-gradient-to-br ${item} border-2 transition-all ${
                    gradient === item
                      ? "border-slate-900 scale-105"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  aria-label={item}
                />
              ))}
            </div>
          </Field>
        </div>

        <Field
          label="URL video YouTube"
          hint="Tampil sebagai cover kartu. Boleh link watch, youtu.be, atau ID."
        >
          <input
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Field>

        {/* Screenshots */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Screenshot</label>
            <button
              type="button"
              onClick={() =>
                setScreenshots([
                  ...screenshots,
                  { key: crypto.randomUUID(), image_url: "", caption: "" },
                ])
              }
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </div>

          {screenshots.length === 0 ? (
            <p className="text-xs text-slate-400">
              Belum ada screenshot — panel detail akan memakai placeholder.
            </p>
          ) : (
            <div className="space-y-3">
              {screenshots.map((shot, index) => (
                <div
                  key={shot.key}
                  className="flex items-start gap-3 p-3 rounded-xl border border-slate-200"
                >
                  <div className="flex-1 space-y-2">
                    <ImageUploader
                      value={shot.image_url || null}
                      onChange={(url) =>
                        setScreenshots(
                          screenshots.map((s) =>
                            s.key === shot.key ? { ...s, image_url: url ?? "" } : s,
                          ),
                        )
                      }
                      folder="screenshots"
                      aspect="video"
                    />
                    <input
                      value={shot.caption}
                      onChange={(e) =>
                        setScreenshots(
                          screenshots.map((s) =>
                            s.key === shot.key ? { ...s, caption: e.target.value } : s,
                          ),
                        )
                      }
                      className={inputClass}
                      placeholder="Caption (opsional)"
                    />
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => moveScreenshot(index, -1)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                      aria-label="Naikkan"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveScreenshot(index, 1)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                      aria-label="Turunkan"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setScreenshots(screenshots.filter((s) => s.key !== shot.key))
                      }
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600"
                      aria-label="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Card title="Distribusi (tombol Install)">
        <p className="text-xs text-slate-500 -mt-1">
          Isi salah satu. Kalau file diupload, tombol Install memakai file itu dan
          mengabaikan URL.
        </p>

        <Field label="File rilis (APK / ZIP / EXE)">
          {releasePath ? (
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {releasePath.split("/").pop()}
                </p>
                <p className="text-xs text-slate-500">
                  {formatBytes(releaseSize) ?? "ukuran tidak diketahui"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReleasePath(null);
                  setReleaseSize(null);
                }}
                className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 shrink-0"
                aria-label="Hapus file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => releaseInputRef.current?.click()}
              disabled={uploadingRelease}
              className="w-full p-4 rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              {uploadingRelease ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploadingRelease ? "Mengupload…" : "Pilih file rilis"}
            </button>
          )}
          <input
            ref={releaseInputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleReleaseFile(e.target.files?.[0])}
          />
        </Field>

        <Field label="Atau URL download eksternal">
          <input
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            className={inputClass}
            placeholder="https://github.com/user/repo/releases/latest"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Versi">
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className={inputClass}
              placeholder="1.0.0"
            />
          </Field>

          <Field
            label="Developer"
            hint={
              developers.length >= 5
                ? "Maksimal 5 developer."
                : "Tekan Enter untuk menambah, maksimal 5."
            }
          >
            <div className="flex flex-wrap gap-2 mb-2">
              {developers.map((dev) => (
                <span
                  key={dev}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-sm text-slate-700"
                >
                  {dev}
                  <button
                    type="button"
                    onClick={() => setDevelopers(developers.filter((d) => d !== dev))}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={developerInput}
              onChange={(e) => setDeveloperInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addDeveloper();
                }
              }}
              disabled={developers.length >= 5}
              className={inputClass}
              placeholder="Gilang Store"
            />
          </Field>
        </div>
      </Card>

      <Card title="Link tambahan">
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.key} className="flex items-start gap-2">
              <select
                value={link.type}
                onChange={(e) =>
                  setLinks(
                    links.map((l) =>
                      l.key === link.key
                        ? { ...l, type: e.target.value as AppLinkType }
                        : l,
                    ),
                  )
                }
                className={`${inputClass} w-32 shrink-0`}
              >
                {LINK_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>

              <input
                value={link.url}
                onChange={(e) =>
                  setLinks(
                    links.map((l) =>
                      l.key === link.key ? { ...l, url: e.target.value } : l,
                    ),
                  )
                }
                className={inputClass}
                placeholder="https://github.com/…"
              />

              <input
                value={link.label}
                onChange={(e) =>
                  setLinks(
                    links.map((l) =>
                      l.key === link.key ? { ...l, label: e.target.value } : l,
                    ),
                  )
                }
                className={`${inputClass} w-40 shrink-0`}
                placeholder="Label"
              />

              <button
                type="button"
                onClick={() => setLinks(links.filter((l) => l.key !== link.key))}
                className="p-2.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 shrink-0"
                aria-label="Hapus link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setLinks([
              ...links,
              { key: crypto.randomUUID(), type: "github", url: "", label: "" },
            ])
          }
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
        >
          <Plus className="w-4 h-4" />
          Tambah link
        </button>
      </Card>

      <Card title="Publikasi">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AppStatus)}
              className={inputClass}
            >
              <option value="draft">Draft (tidak tampil di store)</option>
              <option value="published">Published</option>
            </select>
          </Field>

          <Field label="Urutan tampil" hint="Angka kecil tampil lebih dulu.">
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className={inputClass}
            />
          </Field>

          <Field label="Rating (0–5)">
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid md:grid-cols-3 gap-4 items-end">
          <Field label="Rating usia">
            <select
              value={contentRating}
              onChange={(e) => setContentRating(e.target.value)}
              className={inputClass}
            >
              {CONTENT_RATINGS.map((item) => (
                <option key={item} value={item}>
                  Rated {item}
                </option>
              ))}
            </select>
          </Field>

          <label className="flex items-center gap-2.5 text-sm text-slate-700 py-2.5">
            <input
              type="checkbox"
              checked={hasIap}
              onChange={(e) => setHasIap(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            Ada in-app purchase
          </label>

          <label className="flex items-center gap-2.5 text-sm text-slate-700 py-2.5">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            Editor&apos;s Choice
          </label>
        </div>
      </Card>

      <div className="flex items-center gap-3 sticky bottom-0 bg-slate-50/90 backdrop-blur-sm py-4">
        <button
          type="submit"
          disabled={saving || uploadingRelease}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {app ? "Simpan perubahan" : "Buat app"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/apps")}
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
