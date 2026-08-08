"use client";
import { useState } from "react";
import { PackageOpen } from "lucide-react";

import MobileHeader from "./MobileHeader";
import AppStoreGrid from "./AppStoreGrid";
import type { AppWithRelations, Banner, Platform } from "@/lib/types";

/**
 * Menyatukan header (tab platform) dan grid supaya filter tab benar-benar
 * memfilter daftar app — sebelumnya tab hanya berubah warna.
 */
export default function Storefront({
  apps,
  banners,
}: {
  apps: AppWithRelations[];
  banners: Banner[];
}) {
  const [activePlatform, setActivePlatform] = useState<Platform>("mobile");

  const filteredApps = apps.filter((app) => app.platform === activePlatform);

  return (
    <>
      <MobileHeader
        banners={banners}
        activePlatform={activePlatform}
        onPlatformChange={setActivePlatform}
      />

      <div className="pb-4 flex-1 bg-white">
        {filteredApps.length > 0 ? (
          <AppStoreGrid apps={filteredApps} />
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <PackageOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Belum ada app di sini
            </h3>
            <p className="text-sm text-slate-500 max-w-sm">
              {apps.length === 0
                ? "Tambahkan app pertama Anda lewat halaman admin, lalu set statusnya jadi Published."
                : "Belum ada app untuk kategori ini. Coba tab lain."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
