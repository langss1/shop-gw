import Link from "next/link";
import { Pencil, Plus } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import BannerRowActions from "@/components/admin/BannerRowActions";
import type { Banner } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  const banners = (data ?? []) as Banner[];

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Banners</h1>
          <p className="text-sm text-slate-500 mt-1">
            Carousel di bagian atas storefront. {banners.filter((b) => b.is_active).length}{" "}
            aktif.
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Banner Baru
        </Link>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 mb-4">
          {error.message}
        </div>
      )}

      {banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 px-5 py-12 text-center">
          <p className="text-sm text-slate-500">
            Belum ada banner. Storefront akan memakai banner bawaan sampai Anda
            menambahkan satu.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-stretch"
            >
              <div className="w-32 md:w-48 relative shrink-0">
                {banner.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={banner.image_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${banner.gradient}`}
                  />
                )}
              </div>

              <div className="flex-1 p-4 flex items-center gap-3 min-w-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    Banner · urutan {banner.sort_order}
                  </p>
                  {banner.link_url && (
                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      {banner.link_url}
                    </p>
                  )}
                </div>

                <BannerRowActions
                  id={banner.id}
                  label={`banner urutan ${banner.sort_order}`}
                  isActive={banner.is_active}
                />

                <Link
                  href={`/admin/banners/${banner.id}/edit`}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors shrink-0"
                  aria-label={`Edit banner urutan ${banner.sort_order}`}
                >
                  <Pencil className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
