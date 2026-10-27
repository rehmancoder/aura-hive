import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { servicePath, services } from "@/lib/site";

// Add new pages here so Google can find them.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-10-27"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date("2026-10-27"),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: new Date("2026-10-27"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date("2026-10-27"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    ...services.map((s) => ({
      url: `${siteUrl}${servicePath(s.slug)}`,
      lastModified: new Date("2026-10-27"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
