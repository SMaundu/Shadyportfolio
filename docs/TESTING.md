# Testing results

Run on 14 Nov 2026 against the `revamp` branch (local dev server + production build).

## Automated checks

| Check | Result |
| --- | --- |
| `tsc` app + functions (`npm run typecheck`) | Pass, 0 errors |
| ESLint (`npm run lint`) | Pass, 0 errors, 0 warnings |
| Backend tests (`npm test`) | **23 / 23 pass** |
| Production build (`npm run build`) | Pass; 22 pre-rendered route shells + sitemap (23 URLs) |
| CSP hash of the inline theme script | Matches the built `dist/index.html` |

Backend tests cover: schema validation (valid, bad email, short description, missing consent, unknown service, currency/budget mismatch), happy path (stored in Supabase, notification to shadrackmaundu007@gmail.com with Reply-To), optional visitor confirmation, HTML escaping, field errors, honeypot, instant submissions, link spam, database rate limit (429 + Retry-After), in-memory fallback limit, origin/method/content-type checks, deploy-preview origins, partial failure (email only) and total failure (502); Cal.com signature verification, bad signatures (401), ping, booking stored + notification, cancellation and reschedule handling.

## Browser tests (headless Chrome)

| Scenario | Result |
| --- | --- |
| Hero, sections and footer render at 1440×900 | Pass |
| Work grid shows 7 projects, "Show all" reveals 21 | Pass |
| Category filters (Software shows 4; aria-pressed set) | Pass |
| "Also built" list under Software | Pass |
| Service "Enquire about …" pre-selects the form and scrolls to Contact | Pass |
| Empty form submit shows 7 field errors with aria-invalid | Pass |
| Server unavailable → error state with email/WhatsApp fallback; answers kept | Pass |
| Successful response → success state with reference number | Pass |
| Submitted payload (currency, budget, honeypot, timing) | Pass |
| Mobile menu opens as dialog, closes and scrolls to section | Pass |
| No horizontal overflow at 390 px | Pass |
| All 21 case-study pages render; titles set per page | Pass |
| Header links from a case study go to `/#section` | Pass |
| `/book` renders (honest fallback while Cal.com is not configured) | Pass |
| Unknown routes and unknown projects → 404 page | Pass |
| Light theme preference, theme toggle | Pass |
| Reduced motion stops marquee/auto-rotation | Pass |
| No placeholder links; CV downloads and internal files resolve | Pass |
| Browser console errors | None (except the expected 503 while no API keys are set) |

## Still to verify once accounts are connected

These need the Supabase, Resend and Cal.com keys (see BACKEND.md):

- [ ] Real enquiry → email arrives at shadrackmaundu007@gmail.com
- [ ] Real enquiry → row in Supabase `enquiries`
- [ ] Rate limit triggers on the 4th enquiry within 10 minutes (live)
- [ ] Real booking on `/book` → Cal.com confirmation email to the visitor
- [ ] Booking → row in Supabase `bookings` + notification email
- [ ] Live Netlify deployment: headers, CSP, `/api/*` routes, sitemap
