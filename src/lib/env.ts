import "server-only";

/**
 * The live domain, used for canonical URLs, Open Graph, the sitemap and structured data.
 * On Vercel, set NEXT_PUBLIC_SITE_URL to your custom domain (e.g. https://aurahive.ae).
 * Until you do, the Vercel production URL is used automatically.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

/** Only the production deployment is indexed by search engines. Vercel preview deployments are not. */
export const isProduction = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";
