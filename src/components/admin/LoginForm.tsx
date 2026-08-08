"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // refresh() supaya layout server membaca ulang session yang baru.
    router.replace(nextPath);
    router.refresh();
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
        Env Supabase belum terisi. Buat <code>.env.local</code> dengan{" "}
        <code>NEXT_PUBLIC_SUPABASE_URL</code> dan{" "}
        <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>, lalu restart dev server.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Password
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Masuk
      </button>
    </form>
  );
}
