import { NextResponse, type NextRequest } from "next/server";

import { getPublishedApps } from "@/lib/queries";
import { PLATFORMS } from "@/lib/constants";
import type { Platform } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/v1/apps?platform=mobile&category=Cybersecurity */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const platformParam = params.get("platform");
  const category = params.get("category") ?? undefined;

  const platform = PLATFORMS.some((p) => p.id === platformParam)
    ? (platformParam as Platform)
    : undefined;

  const apps = await getPublishedApps({ platform, category });

  return NextResponse.json({ count: apps.length, data: apps });
}
