# Testing results

## Hero illustration and tool logos (14 Nov 2026, third round)

| Check | Result |
| --- | --- |
| Type-check, lint, backend tests 23 / 23, production build | Pass |
| Responsive sweep: 5 pages x 10 widths (320 to 2560 px) | **50 / 50 pass** |
| Browser interaction tests | **29 / 29 pass** |
| Hero illustration never overlaps the statement (in flow above it from 1024 px; beside the headline at 768 px; hidden on phones) | Checked at 768, 1024, 1280x720, 1440, 1920, 2560, dark and light |
| Nib tip stays on the `</>` stroke while the cursor moves | 0 px drift |
| Reduced motion: illustration shows its finished state immediately | Pass |
| Tools strip logos load (12 tools, duplicated for the loop) | 24 / 24 |
| Console errors | None (except the expected 503 while no API keys are set) |

## Design update (14 Nov 2026, second round)

| Check | Result |
| --- | --- |
| Type-check, lint (0 warnings), backend tests 23 / 23, production build | Pass |
| Responsive sweep: 5 pages x 10 widths (320, 360, 390, 414, 768, 1024, 1280, 1440, 1920, 2560 px), no horizontal scroll or clipped text | **50 / 50 pass** |
| Browser interaction tests (filters, service links, form errors/success, mobile menu, routing, 404, themes, reduced motion, links, CVs) | **29 / 29 pass** |
| Poster wall images loaded after scrolling to the section | 48 / 48 |
| Mont "DEMO" glyphs: every Mont text node has the DEMO-producing features off; DEMO-only characters fall back to Montserrat | Pass |
| Image payload | 174 images, 13.4 MB total (was 23 MB) |

The first-round results below still apply to the backend and booking flow.

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
