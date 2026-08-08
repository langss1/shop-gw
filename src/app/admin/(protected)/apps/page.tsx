import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import AppRowActions from "@/components/admin/AppRowActions";
import type { App } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminAppsPage(props: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await props.searchParams;
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("apps")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("name", `%${q}%`);
  if (status === "draft" || status === "published") query = query.eq("status", status);

  const { data, error } = await query;
  const apps = (data ?? []) as App[];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Apps</h1>
          <p className="text-sm text-slate-500 mt-1">
            {apps.length} app terdaftar.
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

      {/* Filter */}
      <form className="flex flex-wrap items-center gap-2 mb-4">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Cari nama app…"
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white flex-1 min-w-[180px]"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white outline-none focus:border-blue-500"
        >
          <option value="">Semua status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
        >
          Terapkan
        </button>
      </form>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 mb-4">
          {error.message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {apps.length === 0 ? (
          <p className="px-5 py-12 text-sm text-slate-500 text-center">
            Tidak ada app yang cocok.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {apps.map((app) => (
              <li
                key={app.id}
                className="flex items-center gap-3 px-4 md:px-5 py-3 hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white font-bold`}
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

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {app.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {app.category} · {app.platform} · {app.download_count} unduhan
                  </p>
                </div>

                <AppRowActions id={app.id} name={app.name} status={app.status} />

                <Link
                  href={`/admin/apps/${app.id}/edit`}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
                  aria-label={`Edit ${app.name}`}
                >
                  <Pencil className="w-4 h-4" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
