"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { deleteApp, toggleAppStatus } from "@/lib/actions/apps";
import type { AppStatus } from "@/lib/types";

export default function AppRowActions({
  id,
  name,
  status,
}: {
  id: string;
  name: string;
  status: AppStatus;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleToggle() {
    const next: AppStatus = status === "published" ? "draft" : "published";
    startTransition(async () => {
      const result = await toggleAppStatus(id, next);
      if (!result.ok) alert(result.error);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteApp(id);
      if (!result.ok) alert(result.error);
      setConfirming(false);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleToggle}
        disabled={pending}
        className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
          status === "published"
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
        title={
          status === "published" ? "Klik untuk jadikan draft" : "Klik untuk publish"
        }
      >
        {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : status}
      </button>

      {confirming ? (
        <span className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            disabled={pending}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-red-600 text-white hover:bg-red-500 disabled:opacity-50"
          >
            Hapus {name}?
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
          aria-label={`Hapus ${name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
