import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import AppForm from "@/components/admin/AppForm";

export const dynamic = "force-dynamic";

export default async function NewAppPage() {
  await requireAdmin();

  return (
    <div>
      <Link
        href="/admin/apps"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke daftar
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">App Baru</h1>

      <AppForm />
    </div>
  );
}
