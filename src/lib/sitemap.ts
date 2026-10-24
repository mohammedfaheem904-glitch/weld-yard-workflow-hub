import { absoluteUrl, PUBLIC_PATHS } from "./site";

// No <lastmod>: there are no reliable per-page content dates yet.
export function buildSitemap() {
  const urls = PUBLIC_PATHS.map((p) => `  <url><loc>${absoluteUrl(p)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
