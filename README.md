# ResetWell Plus

Marketing + lead-capture website for **ResetWell Plus**, an expert-led women's midlife &
menopause wellness platform for India. Built with [Astro](https://astro.build) and
[Tailwind CSS](https://tailwindcss.com), deployed on [Vercel](https://vercel.com). Pages are
pre-rendered to static HTML; the contact and SMS-consent forms are backed by serverless API
routes that write to Postgres and send email via [Resend](https://resend.com).

## Tech stack

- **Astro 4** with `output: 'hybrid'` — every page is static except a couple of API routes
- **@astrojs/vercel** serverless adapter (functions run on Node **20**)
- **Tailwind CSS** for styling; brand tokens in `tailwind.config.mjs`
- **Geist** (single typeface site-wide, via `@fontsource-variable/geist`)
- **@vercel/postgres** (Neon) for data, **Resend** for transactional email

## Quick start

```bash
npm install      # install dependencies
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build (Vercel output)
npm run preview  # preview the build locally
```

Use **Node 20** (`.nvmrc` + `engines` pin it — Node 20 maps to the `nodejs20.x` Vercel runtime).
Run `nvm use` to switch.

## Project structure

```
src/
  data/            # single source of truth for copy + config
    nav.ts         # navigation architecture
    content.ts     # stats, care needs, steps, specialists, testimonials, FAQs, events
    seo.ts         # brand, SITE config, contact details, org JSON-LD
  layouts/
    BaseLayout.astro   # <head>/SEO, Nav, Footer, fonts, scroll-reveal
    PageLayout.astro   # inner-page wrapper: breadcrumb + title + lede + slot
  components/          # Hero, CareGrid, ThreePathways, HowItWorks, Testimonials, Faq, …
  lib/
    db.ts          # Postgres pool (reads POSTGRES_URL or DATABASE_URL)
  pages/
    index.astro    # homepage
    api/           # serverless endpoints (prerender = false)
      contact.ts        # POST → contact_messages + Resend email
      sms-consent.ts    # POST → sms_consent
    about/ get-care/ events/ community/ understand-your-symptoms/
    book.astro contact.astro sms-consent.astro
    privacy-policy.astro terms.astro disclaimer.astro coming-soon.astro 404.astro
db/
  contact_messages.sql   # table schema
  sms_consent.sql        # table schema
  migrate.sh             # apply all db/*.sql to a Postgres URL
public/                  # images, favicon, robots.txt, og image
```

Astro uses **file-based routing**: `src/pages/get-care/pricing.astro` → `/get-care/pricing`.

## Editing content & theming

- Most copy lives in `src/data/content.ts` and `src/data/nav.ts` — edit there and it updates
  everywhere. Page-specific copy lives in the page under `src/pages`.
- Brand colours live in `tailwind.config.mjs` (`theme.extend.colors`). Both `font-sans` and
  `font-serif` map to **Geist** for a single consistent typeface; point the `serif` token at a
  serif family to give headings a different look.

## Environment variables

Set these in Vercel → Settings → Environment Variables (scope per environment) and, for local
dev, in `.env.local`. See `.env.example`.

| Variable | Purpose |
|----------|---------|
| `POSTGRES_URL` **or** `DATABASE_URL` | Postgres connection string (the app accepts either) |
| `RESEND_API_KEY` | Resend API key for the contact email |
| `CONTACT_EMAIL_TO` | Where contact-form submissions are emailed |
| `CONTACT_EMAIL_FROM` | Verified Resend sender (e.g. `ResetWell Plus <noreply@resetwellplus.com>`) |
| `PUBLIC_GTM_ID` | Optional. Google Tag Manager container id; loads only after cookie consent |
| `PUBLIC_META_PIXEL_ID` | Optional. Meta Pixel id; loads only after cookie consent |
| `PUBLIC_GSC_VERIFICATION` | Optional. Google Search Console meta-tag verification token |

## Database

Schemas live in `db/*.sql` (idempotent — `CREATE TABLE IF NOT EXISTS`). Apply them with:

```bash
db/migrate.sh "<postgres-connection-string>"   # runs every db/*.sql
```

Run it once per database. Tables: `contact_messages`, `sms_consent`.

## Deployment (Vercel)

Two branches map to two Vercel environments, each with its **own database**:

| Branch | Vercel environment | Database |
|--------|--------------------|----------|
| `main` | Preview | preview DB |
| `release` | Production | prod DB |

Promote preview → production by fast-forwarding `release` to `main`:

```bash
git push origin main:release
```

Vercel rebuilds from Git on every push; the local `.vercel/` build output is gitignored.
