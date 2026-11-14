# Shadrack Maundu — Portfolio

Personal portfolio of **Shadrack Maundu, Creative Designer | Software Developer**.
Live: https://smaunduportfolio.netlify.app

- Animated hero with a design + code illustration (a pen nib drawing `</>`), a tools ticker with each tool's logo, about, experience, a 3D poster wall (square and portrait rows), six selected case studies, services and contact.
- A real backend: enquiries are validated, spam-checked, rate-limited, stored in **Supabase** and emailed with **Resend** through **Netlify Functions**.
- Real consultation booking with **Cal.com**; a signed webhook stores every booking in Supabase.
- Dark-first gold and burgundy design in Mont + Montserrat, light theme, reduced-motion support, responsive from 320 px to 2560 px, SEO and social previews for every page.

## Stack

| Layer | Tools |
| --- | --- |
| Front end | React 18, TypeScript, Vite 5, Tailwind CSS 3, shadcn/ui (Radix), Framer Motion |
| Type | Mont (Fontfabric free weights, headings) + Montserrat (body) |
| Forms | react-hook-form + zod (one schema shared by browser and server) |
| Backend | Netlify Functions (`netlify/functions`), Supabase (Postgres), Resend, Cal.com |
| Tooling | ESLint, Vitest, Python asset pipeline (Pillow + PyMuPDF) |

## Getting started

```bash
npm install
cp .env.example .env      # fill in keys, see docs/BACKEND.md
npm run dev               # http://localhost:8080 (also serves /api/* locally)
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with the Netlify Functions mounted at `/api/*` |
| `npm run build` | Production build + per-route SEO shells + `sitemap.xml` |
| `npm run preview` | Serve the production build |
| `npm run check` | Type-check, lint and run the backend tests |
| `npm run assets:media` | Rebuild optimised images from the original artwork |
| `npm run assets:brand` | Rebuild favicons, social image, logo variants and CV copies |

## Project structure

```
src/
  content/        All copy and data: site.ts, projects.ts, services.ts, experience.ts
                  media.generated.ts (written by the asset pipeline - don't edit)
  components/
    layout/       Header, mobile menu, footer, logo, page transitions
    sections/     Hero, ToolsStrip, About, Experience, PosterWall, Work, Services, Contact
    work/         Project cards and covers, 3D poster ring, lightbox
    contact/      Enquiry form
    motion/       Reveal, image reveal, rotating words, marquee
  lib/            enquiry.ts (shared schema), media/scroll/motion helpers
  pages/          Index, ProjectPage (/work/:slug), Book (/book), NotFound
netlify/
  functions/      enquiry.mts (/api/enquiry), cal-webhook.mts (/api/cal-webhook)
  lib/            config, Supabase, Resend emails, rate limiting, HTTP helpers
supabase/migrations/   Database schema (run once)
scripts/
  assets/         build_assets.py, build_brand.py (image pipeline)
  prerender.ts    Route-specific meta tags + sitemap after build
tests/            Backend tests (Vitest)
docs/             Backend setup, deployment and testing notes
```

## Editing content

- **Projects:** `src/content/projects.ts`. Each project has a slug, categories, summary, cover, deliverables, tools, overview and gallery. Use only real work and facts.
- **Experience, education, skills:** `src/content/experience.ts` (transcribed from the CVs).
- **Services:** `src/content/services.ts`. Each one gets an "Enquire about …" button that pre-selects it in the form.
- **Personal details:** `src/content/site.ts`.
- **CVs:** replace the PDFs in `public/cv/`, or update the paths in `scripts/assets/build_brand.py` and run `npm run assets:brand`.

### Adding images

Originals stay outside the repository (`D:\GRAPHICS`, `E:\React\site-originals`, `E:\Pics`). To add a project image:

1. Add an entry to `MEDIA` in `scripts/assets/build_assets.py`, e.g. `M("my-project/cover", "G:Folder/File.png", "cover")`. PDF and Illustrator pages work too (`"G:Docs/File.pdf#2"`).
2. Run `npm run assets:media` (needs `pip install pillow pymupdf`).
3. Reference the id (`"my-project/cover"`) in `projects.ts`. TypeScript will flag typos.

**Poster wall:** add file names to `POSTER_FILES` (from `D:\GRAPHICS\Fliers`) or `DRIVE_POSTERS` (files saved in `E:\React\drive-posters`) in `build_assets.py`, then run `npm run assets:media`. Square and portrait posters are sorted into their own rows automatically.

**Tool logos:** the "Tools I use" strip reads `tools` in `src/content/experience.ts`; the SVGs live in `src/assets/tools/`. They come from open icon sets: Adobe, Figma, React, Flutter, Java, Python, MySQL and Firebase from the Iconify `logos` set (CC0), Affinity Designer from `vscode-icons` (MIT) and Canva from Devicon (MIT). The logos themselves are their owners' trademarks and are shown only to name the tools. Set `tile: true` for logos that are already an app tile.

**Fonts:** Mont comes from Fontfabric's free release (ExtraLight and Heavy only). Those "DEMO" files draw a "DEMO" badge for a few characters (`/ | # % ~ ^ _ < >`) and through some OpenType features, so `src/index.css` limits Mont with `unicode-range` (those characters fall back to Montserrat) and switches the features off. If you buy the full Mont family, replace the files in `src/assets/fonts/` and remove those workarounds.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). In short: Netlify builds `npm run build`, publishes `dist`, and deploys `netlify/functions`. Environment variables are listed in [docs/BACKEND.md](docs/BACKEND.md).
