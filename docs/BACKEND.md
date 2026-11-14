# Backend setup

The site has two serverless endpoints (Netlify Functions):

| Endpoint | Purpose |
| --- | --- |
| `POST /api/enquiry` | Project enquiry form: validation, spam checks, rate limiting, store in Supabase, email via Resend |
| `POST /api/cal-webhook` | Cal.com webhook: verifies the signature, stores bookings in Supabase, emails a notification |

No secret is ever sent to the browser. The only browser-visible variables start with `VITE_` and are public by design (the Cal.com booking link).

## Environment variables

Set these in **Netlify → Site configuration → Environment variables** (all scopes, all deploy contexts), and in `.env` for local development (`cp .env.example .env`).

| Variable | Required | Secret | Description |
| --- | --- | --- | --- |
| `SUPABASE_URL` | yes | no | `https://<project-ref>.supabase.co` (Project Settings → API) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | **yes** | Service-role key (Project Settings → API). Server-side only. |
| `RESEND_API_KEY` | yes | **yes** | Resend API key with sending access |
| `RESEND_FROM` | no | no | Sender. Default `Shadrack Maundu Portfolio <onboarding@resend.dev>` |
| `NOTIFY_EMAIL` | no | no | Where notifications go. Default `shadrackmaundu007@gmail.com` |
| `SEND_VISITOR_CONFIRMATION` | no | no | `true` to email visitors a confirmation. **Needs a verified domain.** Default `false` |
| `RATE_LIMIT_SALT` | yes | **yes** | Long random string used to hash IPs and emails (e.g. `openssl rand -hex 32`) |
| `CAL_WEBHOOK_SECRET` | yes | **yes** | The secret you type into the Cal.com webhook |
| `VITE_CAL_LINK` | yes | no | Public booking link, `username/event-slug` (e.g. `shadrack-maundu/consultation`) |
| `VITE_CAL_ORIGIN`, `VITE_CAL_EMBED_JS` | no | no | Only for Cal.com EU or self-hosted |
| `ALLOWED_ORIGINS` | no | no | Extra origins allowed to post enquiries (e.g. a future custom domain) |

`VITE_*` variables are baked in at build time, so **trigger a new deploy** after changing them.

## 1. Supabase (database)

1. Create a free project at https://supabase.com (pick the region closest to Kenya, e.g. Frankfurt or London).
2. Open **SQL Editor → New query**, paste the contents of `supabase/migrations/20261114000000_portfolio_backend.sql` and **Run**.
3. Copy **Project URL** and the **service_role** key from **Project Settings → API**.

Tables created:

- `enquiries`: every form submission (reference, contact details, service, budget, timeline, description, notification status, hashed IP).
- `bookings`: every Cal.com booking, reschedule and cancellation.
- `rate_limit_hits` plus the `hit_rate_limit()` function: shared rate limiting across all function instances.

Row Level Security is on with no policies, so the public `anon` key can't read or write anything. View your data in **Table Editor**. You can update an enquiry's `status` (`new`, `replied`, `won`, `lost`, `spam`) and add `notes` there.

## 2. Resend (email)

1. Sign up at https://resend.com **with shadrackmaundu007@gmail.com**.
2. **API Keys → Create API key** (sending access).
3. Keep `RESEND_FROM=Shadrack Maundu Portfolio <onboarding@resend.dev>` for now.

**Important, no custom domain yet:** with the shared `onboarding@resend.dev` sender, Resend only delivers to the email address of the Resend account owner. Notifications to shadrackmaundu007@gmail.com work, but emails to visitors don't, so `SEND_VISITOR_CONFIRMATION` stays `false` and visitors get an on-screen confirmation with a reference number instead.

When you buy a domain:

1. Resend → **Domains → Add domain**, add the DNS records it shows, wait until it shows *Verified*.
2. Set `RESEND_FROM=Shadrack Maundu <hello@yourdomain.com>` and `SEND_VISITOR_CONFIRMATION=true`.
3. Add the domain to Netlify (Domain management) and to `ALLOWED_ORIGINS` if it differs from the Netlify URL.
4. Redeploy.

## 3. Cal.com (booking)

1. Sign up at https://cal.com and connect your Google Calendar (so busy times are blocked) and a video app (Google Meet or Zoom).
2. Create an event type, e.g. **Consultation**, 30 minutes, slug `consultation`. Set your working hours under **Availability**.
3. Your link is `cal.com/<username>/consultation`, so set `VITE_CAL_LINK=<username>/consultation`.
4. **Settings → Developer → Webhooks → New**:
   - Subscriber URL: `https://smaunduportfolio.netlify.app/api/cal-webhook`
   - Events: Booking Created, Booking Rescheduled, Booking Cancelled (Booking Requested/Rejected optional)
   - Secret: a long random string, also set as `CAL_WEBHOOK_SECRET` in Netlify
   - Use **Ping test**. It should return `200`.

Visitors pick a real free slot on `/book`. Cal.com sends them the confirmation email and calendar invite (this works without your own domain), the page shows a "You're booked" confirmation, and the webhook stores the booking and emails you.

## Security and spam protection

- **Validation:** one zod schema (`src/lib/enquiry.ts`) runs in the browser and again on the server.
- **Spam:** hidden honeypot field; submissions faster than 3 seconds are rejected; more than 3 links are rejected; JSON only, max 16 KB.
- **Rate limits:** 3 per 10 minutes and 10 per day per IP; 5 per day per email address. Stored as salted SHA-256 hashes, never raw IPs.
- **Origin check:** only the Netlify site, its deploy previews, local dev and `ALLOWED_ORIGINS` can post.
- **Webhook:** HMAC-SHA256 signature verified with a constant-time comparison.
- **Headers:** CSP, HSTS, X-Frame-Options, Referrer-Policy and Permissions-Policy (see `netlify.toml`).
- **Emails:** all user input is HTML-escaped. Notifications set `Reply-To` to the visitor, so you can answer directly from Gmail.

## Testing locally

```bash
npm run dev     # the form posts to /api/enquiry, served by the Vite dev plugin with keys from .env
npm test        # 23 backend tests (Supabase and Resend mocked)
```

To test the webhook locally, sign a payload with your secret:

```bash
node -e "const c=require('crypto');const b=JSON.stringify({triggerEvent:'PING',payload:{}});console.log(b);console.log(c.createHmac('sha256',process.env.S).update(b).digest('hex'))"
```
