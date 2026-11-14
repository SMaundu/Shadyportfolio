# Shadrack Maundu — Portfolio

Personal portfolio of **Shadrack Maundu, Creative Designer | Software Developer**.
Live: https://smaunduportfolio.netlify.app

- Animated hero, filterable work showcase with 21 case studies, a 3D poster wall, services, about, experience and contact.
- A real backend: enquiries are validated, spam-checked, rate-limited, stored in **Supabase** and emailed with **Resend** through **Netlify Functions**.
- Real consultation booking with **Cal.com**; a signed webhook stores every booking in Supabase.
- Dark-first gold and burgundy design, light theme, reduced-motion support, SEO and social previews for every page.

## Stack

| Layer | Tools |
| --- | --- |
| Front end | React 18, TypeScript, Vite 5, Tailwind CSS 3, shadcn/ui (Radix), Framer Motion |
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
    sections/     Hero, Work, PosterWall, Services, About, Experience, Contact
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

**Hero cut-out:** save a background-free portrait as `E:\React\Logos\hero-cutout.png` and run `npm run assets:media`. The hero switches automatically from the framed photo to the cut-out over the name.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). In short: Netlify builds `npm run build`, publishes `dist`, and deploys `netlify/functions`. Environment variables are listed in [docs/BACKEND.md](docs/BACKEND.md).
