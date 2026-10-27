import { NextResponse, type NextRequest } from "next/server";
import { services } from "@/lib/site";

const slugs = new Set<string>(services.map((s) => s.slug));

/**
 * Unknown service addresses (e.g. /services/typo) get a real 404 before the page renders.
 * Without this, the service page's shared shell is served first with a 200 status,
 * which Google treats as a "soft 404" and Vercel would cache as a new page.
 */
export function proxy(request: NextRequest) {
  const slug = decodeURIComponent(request.nextUrl.pathname.split("/")[2] ?? "");
  if (slugs.has(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
}

export const config = {
  matcher: "/services/:slug",
};
