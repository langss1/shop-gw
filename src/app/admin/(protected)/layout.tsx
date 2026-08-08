import Link from "next/link";
import { LayoutDashboard, Package, Images, LogOut, ExternalLink } from "lucide-react";

import { requireAdmin } from "@/lib/admin";
import { signOut } from "@/lib/actions/auth";

export const metadata = {
  title: "Admin — Gilang Store",
};

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/apps", label: "Apps", icon: Package },
  { href: "/admin/banners", label: "Banners", icon: Images },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="md:w-60 md:min-h-screen bg-white border-b md:border-b-0 md:border-r border-slate-200 flex md:flex-col md:sticky md:top-0 md:h-screen">
        <div className="p-4 md:p-5 border-slate-200 md:border-b flex items-center gap-3 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo1.png"
            alt="Gilang Store"
            className="h-7 w-auto object-contain"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Admin
          </span>
        </div>

        <nav className="flex md:flex-col gap-1 p-2 md:p-3 flex-1 overflow-x-auto">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-2 md:p-3 md:border-t border-slate-200 flex md:flex-col items-center md:items-stretch gap-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            Lihat Store
          </Link>

          <form action={signOut} className="contents">
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Keluar
            </button>
          </form>

          <p className="hidden md:block px-3 pt-2 text-[11px] text-slate-400 truncate">
            {profile.email}
          </p>
        </div>
      </aside>

      <main className="flex-1 p-5 md:p-8 max-w-5xl w-full">{children}</main>
    </div>
  );
}
