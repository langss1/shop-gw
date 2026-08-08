import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Login Admin — Gilang Store",
};

export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await props.searchParams;

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo1.png"
            alt="Gilang Store"
            className="h-9 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-500 mt-1">
            Masuk untuk mengelola app dan banner.
          </p>
        </div>

        {error === "forbidden" && (
          <div className="mb-4 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-800">
            Akun ini bukan admin. Set <code>role=&apos;admin&apos;</code> di tabel{" "}
            <code>profiles</code> lebih dulu.
          </div>
        )}

        <LoginForm nextPath={next ?? "/admin"} />
      </div>
    </main>
  );
}
