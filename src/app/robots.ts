import type { MetadataRoute } from "next";
import { isProduction, siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Keep Vercel preview deployments out of Google; only production is crawlable.
  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
