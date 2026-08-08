import { NextResponse } from "next/server";

import { getActiveBanners } from "@/lib/queries";

export const dynamic = "force-dynamic";

/** GET /api/v1/banners */
export async function GET() {
  const banners = await getActiveBanners();
  return NextResponse.json({ count: banners.length, data: banners });
}
