import Link from "next/link";
import { Package, CheckCircle2, FileEdit, Images, Plus, Download } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import type { App } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin();

  const [{ data: apps }, { count: activeBanners }] = await Promise.all([
    supabase
      .from("apps")
      .select("id, name, slug, status, download_count, updated_at, gradient, icon_url")
      .order("updated_at", { ascending: false }),
    supabase
      .from("banners")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  const rows = (apps ?? []) as Pick<
    App,
    "id" | "name" | "slug" | "status" | "download_count" | "updated_at" | "gradient" | "icon_url"
  >[];

  const published = rows.filter((a) => a.status === "published").length;
  const draft = rows.length - published;
  const downloads = rows.reduce((sum, a) => sum + (a.download_count ?? 0), 0);

  const stats = [
    { label: "Total App", value: rows.length, icon: Package },
    { label: "Published", value: published, icon: CheckCircle2 },
    { label: "Draft", value: draft, icon: FileEdit },
    { label: "Banner Aktif", value: activeBanners ?? 0, icon: Images },
    { label: "Total Unduhan", value: downloads, icon: Download },
  ];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ringkasan isi storefront Gilang Store.
          </p>
        </div>
        <Link
          href="/admin/apps/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          App Baru
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-slate-200 p-4"
          >
            <stat.icon className="w-4 h-4 text-slate-400 mb-3" />
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Terakhir diubah</h2>
          <Link href="/admin/apps" className="text-sm text-blue-600 hover:underline">
            Lihat semua
          </Link>
        </div>

        {rows.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-500 text-center">
            Belum ada app. Klik <strong>App Baru</strong> untuk menambahkan yang pertama.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {rows.slice(0, 5).map((app) => (
              <li key={app.id}>
                <Link
                  href={`/admin/apps/${app.id}/edit`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {app.icon_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={app.icon_url}
                        alt={app.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      app.name.charAt(0)
                    )}
                  </div>
                  <span className="flex-1 text-sm font-medium text-slate-800 truncate">
                    {app.name}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                      app.status === "published"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
