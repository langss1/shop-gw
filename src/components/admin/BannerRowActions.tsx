"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { deleteBanner, toggleBannerActive } from "@/lib/actions/banners";

export default function BannerRowActions({
  id,
  label,
  isActive,
}: {
  id: string;
  label: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() =>
          startTransition(async () => {
            const result = await toggleBannerActive(id, !isActive);
            if (!result.ok) alert(result.error);
            router.refresh();
          })
        }
        disabled={pending}
        className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
          isActive
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        {pending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : isActive ? (
          "aktif"
        ) : (
          "nonaktif"
        )}
      </button>

      {confirming ? (
        <span className="flex items-center gap-1">
          <button
            onClick={() =>
              startTransition(async () => {
                const result = await deleteBanner(id);
                if (!result.ok) alert(result.error);
                setConfirming(false);
                router.refresh();
              })
            }
            disabled={pending}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-500 disabled:opacity-50"
          >
            Hapus?
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="text-[11px] px-2 py-1.5 text-slate-500 hover:text-slate-800"
          >
            Batal
          </button>
        </span>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
          aria-label={`Hapus ${label}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
