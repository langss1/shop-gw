import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/supabase/config";

/**
 * Next.js 16: `middleware` diganti nama jadi `proxy` (runtime nodejs).
 * Tugasnya: refresh session Supabase + jaga /admin dari akses tanpa login.
 * Pengecekan role admin dilakukan di src/app/admin/layout.tsx.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!SUPABASE_URL || !SUPABASE_KEY) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Jangan taruh kode apa pun di antara createServerClient dan getUser():
  // session bisa gagal ter-refresh dan user acak ter-logout.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isForbidden = request.nextUrl.searchParams.get("error") === "forbidden";

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Non-admin user was just bounced here by requireAdmin() with
  // ?error=forbidden — don't redirect them straight back to /admin,
  // that would loop forever since they'll never pass requireAdmin().
  if (user && isLoginPage && !isForbidden) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
