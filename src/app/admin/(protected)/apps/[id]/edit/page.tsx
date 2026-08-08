import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import AppForm from "@/components/admin/AppForm";
import type { AppWithRelations } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditAppPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from("apps")
    .select("*, app_screenshots(*), app_links(*)")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();

  const app = data as AppWithRelations;
  app.app_screenshots = [...(app.app_screenshots ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );
  app.app_links = [...(app.app_links ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div>
      <Link
        href="/admin/apps"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar
      </Link>

      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{app.name}</h1>
        {app.status === "published" && (
          <a
            href={`/#store`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline shrink-0"
          >
            Lihat di store
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      <AppForm app={app} />
    </div>
  );
}
