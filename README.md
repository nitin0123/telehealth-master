# ResetWell Plus

Marketing + lead-capture website for **ResetWell Plus**, an expert-led women's midlife &
menopause wellness platform for India. Built with [Astro](https://astro.build) and
[Tailwind CSS](https://tailwindcss.com), deployed on [Vercel](https://vercel.com). Pages are
pre-rendered to static HTML; the forms, the live poll and a few utility endpoints are backed by
serverless API routes that write to Postgres and send email via [Resend](https://resend.com).

The site is **bilingual (English + Hindi)**, carries a **blog** built from a content collection,
an **English-only corporate section**, and a **live audience poll** used at events.

## Tech stack

- **Astro 4** with `output: 'hybrid'` — every page is static except the API routes and the poll
- **@astrojs/vercel** serverless adapter (functions run on Node **20**)
- **Tailwind CSS** for styling; brand tokens in `tailwind.config.mjs`
- **Geist** for Latin text, **Noto Sans Devanagari** for Hindi (both via `@fontsource-variable`)
- **@vercel/postgres** (Neon) for data, **Resend** for transactional email, **zod** for validation
- **@astrojs/sitemap** with a custom filter and `<lastmod>` (see `astro.config.mjs`)

## Quick start

```bash
npm install      # install dependencies
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build (Vercel output)
npm run preview  # preview the build locally
npm run images   # regenerate responsive/WebP variants under public/
```

Use **Node 20** (`.nvmrc` + `engines` pin it — Node 20 maps to the `nodejs20.x` Vercel runtime).
Run `nvm use` to switch. Anything else falls back to the discontinued `nodejs18.x` and breaks the
deploy.

## Project structure

```
src/
  data/            # single source of truth for copy + config
    nav.ts         # navigation architecture
    content.ts     # stats, care needs, steps, specialists, testimonials, FAQs, events, readiness Qs
    seo.ts         # brand, SITE config, contact details, org JSON-LD
    authors.ts     # blog bylines -> Person schema
    tags.ts        # TAG_INTROS: hand-written intro per indexed blog tag
    tagRules.mjs   # tag slug + indexing threshold, shared with astro.config.mjs (plain ESM)
    quotes.ts / quotes.hi.ts   # daily quote pool per language
    imageMeta.json # width/height manifest written by `npm run images`
  i18n/
    index.ts       # Lang, localePaths(), localizePath(), alternatePath(), useTranslations()
    en.ts hi.ts    # UI dictionaries (hi is a deep-partial overlay on en)
    types.ts GLOSSARY.md
  content/
    config.ts      # blog collection schema (title, synopsis, author, faq, hashtags, …)
    blog/*.md      # English posts
    blog/hi/*.md   # Hindi twins, same slug
  layouts/
    BaseLayout.astro   # <head>/SEO/hreflang, Nav, Footer, fonts, analytics, scroll-reveal
    PageLayout.astro   # inner-page wrapper: breadcrumb + title + lede + slot
  components/          # Hero, CareGrid, ThreePathways, HowItWorks, Testimonials, Faq,
                       # SymptomChecker, PostCard, LangToggle, Picture, Analytics, …
  lib/
    db.ts          # Postgres pool (reads POSTGRES_URL or DATABASE_URL)
    schemas.ts     # zod request schemas, shared by API routes and form scripts
    validate.ts    # dependency-free mirror of those rules for the browser
    formBody.ts    # accept JSON (fetch) or a plain form POST (no-JS fallback)
    rateLimit.ts   # Postgres-backed per-IP limits, with an in-memory fast path
    poll.ts        # respondent cookie, results password, tallying
    readiness.ts   # corporate readiness scoring (recomputed server-side)
    emails/        # Resend templates for the corporate resource + readiness report
  assets/reports/  # PDFs inlined into emails at build time (?base64 vite plugin)
  pages/
    [...locale]/   # EVERY bilingual page: one file builds /x/ and /hindi/x/
      index.astro about/ blog/ community/ events/ get-care/
      understand-your-symptoms/ book.astro contact.astro sms-consent.astro
      privacy-policy.astro terms.astro disclaimer.astro coming-soon.astro thank-you.astro
    about/workplace-wellness*        # English-only corporate section
    poll/                            # /poll (vote) + /poll/results (password-gated board)
    api/                             # serverless endpoints (prerender = false)
    llms-full.txt.ts                 # full-text feed for answer engines
    404.astro
db/
  *.sql            # idempotent table schemas
  migrate.sh       # apply all db/*.sql to an explicit Postgres URL
  push.sh          # same, reading the URL from .env.local / .env.prod
scripts/
  optimize-images.mjs   # `npm run images`
  poll-load-test.sh     # simulate N respondents against a deploy
public/            # images (+ generated -480/webp variants), favicon, robots.txt, llms.txt, og image
```

Astro uses **file-based routing**: `src/pages/[...locale]/get-care/pricing.astro` builds both
`/get-care/pricing` and `/hindi/get-care/pricing`.

## Routing & i18n

Language is derived from the URL: anything under `/hindi/` is Hindi, everything else is English.

- Bilingual pages live under `src/pages/[...locale]/` and export
  `export const getStaticPaths = localePaths` — the rest parameter collapses when undefined, so a
  single source file builds both URLs instead of a mirrored tree.
- Components read copy with `useTranslations(Astro.url)`; no `lang` prop is threaded through.
  `src/i18n/hi.ts` is a deep-partial overlay, so anything untranslated falls back to English.
- `EN_ONLY` in `src/i18n/index.ts` lists the prefixes that exist in English only (`/404`,
  `/about/workplace-wellness`, `/poll`). Those pages get no language toggle and no hreflang, so a
  partially translated site never links to a 404.

## Blog

Add a post by dropping a markdown file in `src/content/blog/` — the index, the post template and
the sitemap pick it up at build time. Frontmatter is validated by `src/content/config.ts`
(`title`, `synopsis`, `author`, `publishedAt`, optional `quickAnswer`, `faq`, `hashtags`,
`linkedin`, `draft`, …). A Hindi translation is the same slug under `src/content/blog/hi/`.

**Tag pages** (`/blog/tag/<slug>/`, built per language from `hashtags:`) are indexed only once a
tag lists `TAG_INDEX_MIN_POSTS` posts *and* has a hand-written intro in `TAG_INTROS`
(`src/data/tags.ts`). Below the threshold a tag renders `noindex, follow` and drops out of the
sitemap. The threshold lives in `src/data/tagRules.mjs`, which is plain ESM so the page code and
`astro.config.mjs`'s sitemap filter share one definition.

## Forms & API routes

Every endpoint is `prerender = false`. The form endpoints validate with the shared zod schemas,
are rate-limited per IP (`src/lib/rateLimit.ts`), carry a honeypot field that returns a fake
success rather than an error, and accept JSON from the page's `fetch` **or** a plain form POST
when JavaScript did not run. The honeypot is `company` everywhere except `poll-identify`, which
asks for the company as a real field and uses `website` instead. `poll-auth` is rate-limited but
has neither honeypot nor schema; `poll-stream` and `csp-report` have none of the three.

| Route | Does |
|-------|------|
| `api/contact.ts` | insert `contact_messages` + notification email |
| `api/subscribe.ts` | insert `subscribers` (community join + coming-soon "notify me") |
| `api/sms-consent.ts` | insert `sms_consent` as documented proof of opt-in |
| `api/corporate-lead.ts` | insert `corporate_leads`, email the gated PDF, notify the team |
| `api/corporate-readiness.ts` | score server-side, insert `corporate_readiness`, email the report |
| `api/poll-identify.ts` | capture a respondent once, issue their opaque token cookie |
| `api/poll-vote.ts` | record one vote if the poll is open and the voter is identified |
| `api/poll-stream.ts` | live results over SSE, closing inside the function time cap |
| `api/poll-auth.ts` | exchange `POLL_RESULTS_PASSWORD` for a results cookie |
| `api/csp-report.ts` | log CSP violations to the Vercel function logs (not stored) |

## Editing content & theming

- Shared copy lives in `src/data/content.ts` and `src/data/nav.ts`; UI strings live in
  `src/i18n/en.ts` / `hi.ts`. Page-specific copy stays in the page under `src/pages`.
- Brand colours live in `tailwind.config.mjs` (`theme.extend.colors`). Both `font-sans` and
  `font-serif` map to **Geist**; Devanagari text falls through to Noto Sans Devanagari.
- Images: add the source to `public/`, then run `npm run images`. It writes `-480` and `.webp`
  variants next to the original and records dimensions in `src/data/imageMeta.json`, which the
  `<Picture>` component reads so width/height are always emitted (no layout shift). Originals are
  never modified.

## Environment variables

Set these in Vercel → Settings → Environment Variables (scope per environment) and, for local
dev, in `.env.local`. See `.env.example`.

| Variable | Purpose |
|----------|---------|
| `POSTGRES_URL` **or** `DATABASE_URL` | Postgres connection string (the app accepts either) |
| `RESEND_API_KEY` | Resend API key for outgoing email |
| `CONTACT_EMAIL_TO` | Where form submissions are emailed |
| `CONTACT_EMAIL_FROM` | Verified Resend sender (e.g. `ResetWell Plus <noreply@resetwellplus.com>`) |
| `POLL_RESULTS_PASSWORD` | Shared password for `/poll/results/`. Unset means the page cannot be unlocked, which is the safe default |
| `PUBLIC_GTM_ID` | Optional. Google Tag Manager container id; loads only after cookie consent |
| `PUBLIC_GA4_ID` | Optional. GA4 measurement id via gtag.js; skip if GA4 is a tag inside GTM |
| `PUBLIC_META_PIXEL_ID` | Optional. Meta Pixel id; loads only after cookie consent |
| `PUBLIC_META_DOMAIN_VERIFICATION` | Optional. Meta domain-verification meta-tag token |
| `PUBLIC_GSC_VERIFICATION` | Optional. Google Search Console meta-tag verification token |
| `PUBLIC_AHREFS_KEY` | Optional. Ahrefs Web Analytics site key (`data-key`). Cookieless, so it loads without the cookie-consent gate |

`PUBLIC_*` values are baked in at build time, so changing one needs a redeploy to take effect.

### Analytics & security headers

- **GTM / GA4 / Meta Pixel** are cookie-based: they load **only after** the visitor accepts the
  cookie banner (see `src/components/Analytics.astro`).
- **Ahrefs Web Analytics** is cookieless, so it loads for every visitor without consent. The tag
  lives in `BaseLayout.astro`'s `<head>`.
- `vercel.json` sets HSTS, `X-Frame-Options`, `Referrer-Policy`, a `Permissions-Policy` and a
  **CSP** (plus a report-only variant reporting to `/api/csp-report`). Any new third-party tag
  must have its domain added to `script-src`, and to `connect-src` if it sends data, or the
  browser will silently block it.

## Database

Schemas live in `db/*.sql` (idempotent — `CREATE TABLE IF NOT EXISTS`). Apply them with:

```bash
npm run db:push        # preview DB   (.env.local: POSTGRES_URL / DATABASE_URL)
```

```bash
npm run db:push:prod   # production   (.env.prod: PROD_DATABASE_URL)
```

Both wrap `db/push.sh`, which reads the connection string from the matching `.env` file so you
never paste URLs. `db/migrate.sh "<postgres-url>"` is the low-level form that takes an explicit
URL.

Pushing creates missing tables but does **not** alter existing ones. For a schema change, add an
idempotent `ALTER TABLE … ADD COLUMN IF NOT EXISTS` to the relevant `db/*.sql` first, then push.

Tables: `contact_messages`, `subscribers`, `sms_consent`, `corporate_leads`,
`corporate_readiness`, `rate_limits`, and the poll set (`polls`, `poll_options`,
`poll_respondents`, `poll_runs`, `poll_votes`).

## Live poll

`/poll` collects a vote; `/poll/results` is a password-gated board that updates over SSE. Both
render `noindex` and stay out of the sitemap. `poll.resetwellplus.com` redirects to `/poll/` via
`vercel.json`. Poll content itself comes from the database, not from code.

To rehearse before an event, drive N synthetic respondents at a deployment:

```bash
scripts/poll-load-test.sh 500
```

```bash
JOBS=8 PACE=0 scripts/poll-load-test.sh 500
```

With no URL it asks `vercel ls` for the newest **Preview** deployment, since a preview URL changes
on every push and a stale one still answers. The poll must be `open`; the script preflights that
and prints the cleanup SQL for the rows it creates. A protected preview needs
`export VERCEL_AUTOMATION_BYPASS_SECRET=…`. Each respondent costs two round trips, so `JOBS` is
the only way to reproduce a room answering at once.

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

Vercel rebuilds from Git on every push; the local `.vercel/` build output is gitignored. All
`.env*` files except `.env.example` are gitignored — never commit a connection string.
