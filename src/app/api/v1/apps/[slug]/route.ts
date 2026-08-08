import { NextResponse } from "next/server";

import { getAppBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** GET /api/v1/apps/[slug] — Next 16: `params` adalah Promise. */
export async function GET(
  _request: Request,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const app = await getAppBySlug(slug);

  if (!app) {
    return NextResponse.json({ error: "App tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: app });
}
