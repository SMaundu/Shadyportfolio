/**
 * Post-build step: writes route-specific HTML shells so link previews and
 * crawlers get the right title, description and image for every case study
 * and the booking page, and generates sitemap.xml.
 *
 * Runs automatically after `vite build` (see package.json "build").
 */
import fs from "node:fs";
import path from "node:path";
import { media } from "../src/content/media.generated";
import { projects } from "../src/content/projects";

const SITE = (process.env.VITE_SITE_URL ?? "https://smaunduportfolio.netlify.app").replace(/\/$/, "");
const DIST = path.resolve(import.meta.dirname, "../dist");
const shell = fs.readFileSync(path.join(DIST, "index.html"), "utf8");

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function render(route: string, title: string, description: string, image?: string): string {
  const url = `${SITE}${route}`;
  const img = image ? `${SITE}${image}` : `${SITE}/og-image.jpg`;
  const t = esc(`${title} | Shadrack Maundu`);
  const d = esc(description);
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
    .replace(/(<meta name="description"\s+content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${img}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${d}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${img}$2`)
    .replace(/<meta property="og:image:width"[^>]*>\s*<meta property="og:image:height"[^>]*>/, "");
}

/**
 * Written as `work/slug.html`, not `work/slug/index.html`: Netlify serves
 * `/work/slug` straight from the .html file, whereas a folder index makes it
 * 301-redirect to `/work/slug/`, which no longer matches the canonical URL.
 */
function write(route: string, html: string) {
  const file = path.join(DIST, `${route}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

/** Prefer the JPEG social image (widest platform support), else the largest WebP. */
const socialImage = (id: string | null) => {
  const a = id ? (media as Record<string, { srcs: Record<string, string>; og?: string }>)[id] : undefined;
  if (!a) return undefined;
  return a.og ?? Object.entries(a.srcs).sort((x, y) => Number(y[0]) - Number(x[0]))[0][1];
};

const routes: string[] = ["/", "/book"];
write(
  "book",
  render(
    "/book",
    "Book a consultation",
    "Book a consultation call with Shadrack Maundu to talk about your brand, design, website or app project.",
  ),
);
for (const p of projects) {
  write(path.join("work", p.slug), render(`/work/${p.slug}`, p.title, p.summary, socialImage(p.cover)));
  routes.push(`/work/${p.slug}`);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) =>
      `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod><priority>${r === "/" ? "1.0" : r === "/book" ? "0.8" : "0.7"}</priority></url>`,
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(DIST, "sitemap.xml"), sitemap);
console.log(`prerender: ${routes.length - 1} route shells + sitemap.xml (${routes.length} URLs)`);
