# Deployment (Netlify)

`netlify.toml` contains everything Netlify needs:

- Build command `npm run build`, publish directory `dist`, Node 22
- Functions directory `netlify/functions` (bundled with esbuild)
- SPA fallback redirect, security headers (CSP, HSTS…) and cache rules

## First-time setup

1. **Netlify → Site configuration → Build & deploy → Continuous deployment**: make sure the site is linked to `github.com/SMaundu/Shadyportfolio`, production branch `main`.
2. Under **Branches and deploy contexts**, enable **Deploy previews** (and optionally **Branch deploys: All**) so the `revamp` branch can be previewed before it goes live.
3. Add the environment variables from [BACKEND.md](BACKEND.md) (Site configuration → Environment variables).
4. Trigger a deploy (Deploys → Trigger deploy → Clear cache and deploy site).

## Release flow

1. Push work to a branch (e.g. `revamp`) and open a pull request into `main`. Netlify builds a deploy preview at `https://deploy-preview-<n>--smaunduportfolio.netlify.app`.
2. Check the preview: pages, form (`/api/enquiry`), booking (`/book`).
3. Merge the pull request. Netlify deploys `main` to https://smaunduportfolio.netlify.app.

## After going live

- **Cal.com webhook** must point at the production URL: `https://smaunduportfolio.netlify.app/api/cal-webhook`.
- **Google Search Console**: add the property and submit `https://smaunduportfolio.netlify.app/sitemap.xml`.
- **Custom domain (later)**: add it in Netlify (Domain management) and update `VITE_SITE_URL`, `ALLOWED_ORIGINS`, the URLs in `index.html` and `public/robots.txt`, plus the Resend domain (see BACKEND.md).

## Checklist

- [ ] `npm run check` passes (type-check, lint, tests)
- [ ] `npm run build` passes
- [ ] Environment variables set in Netlify
- [ ] Supabase migration run
- [ ] Test enquiry received at shadrackmaundu007@gmail.com and visible in Supabase → `enquiries`
- [ ] Test booking made on `/book`, confirmation email received, row in Supabase → `bookings`
- [ ] Cal.com webhook ping returns 200
