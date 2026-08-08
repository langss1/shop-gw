import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import BannerForm from "@/components/admin/BannerForm";
import type { Banner } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditBannerPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const { supabase } = await requireAdmin();

  const { data } = await supabase.from("banners").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <div>
      <Link
        href="/admin/banners"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Banner</h1>

      <BannerForm banner={data as Banner} />
    </div>
  );
}
