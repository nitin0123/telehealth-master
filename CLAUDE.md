# CLAUDE.md

Guidance for working in this repo. Read alongside `README.md`.

## What this is

Marketing + lead-capture site for **ResetWell Plus** (women's midlife/menopause wellness, India).
**Astro 4** (`output: 'hybrid'`) + **Tailwind**, deployed on **Vercel**. Pages are pre-rendered
static; only the API routes run as serverless functions.

## Commands

```bash
npm run build     # ALWAYS run this to verify a change compiles before committing
npm run dev       # local dev server (see note below)
npm run db:push        # apply db/*.sql to the PREVIEW db (.env.local: POSTGRES_URL/DATABASE_URL)
npm run db:push:prod   # apply db/*.sql to the PRODUCTION db (.env.prod: PROD_DATABASE_URL)
db/migrate.sh "<postgres-url>"   # low-level: apply db/*.sql to an explicit URL

scripts/poll-load-test.sh <base-url> [count] [poll-id]   # simulate poll respondents
```

- `scripts/poll-load-test.sh` drives `/api/poll-identify` + `/api/poll-vote` as N separate
  people, to watch the results board fill up before a live event. It preflights the deployment
  and the poll's status, so it stops with a reason rather than failing silently. A protected
  preview needs `export VERCEL_AUTOMATION_BYPASS_SECRET=…` (Vercel → Settings → Deployment
  Protection → Protection Bypass for Automation); production needs nothing. The poll must be
  `open` first, and the script prints the cleanup SQL for the rows it creates.

- `db:push` / `db:push:prod` wrap `db/push.sh`, which reads the connection string from the
  matching `.env` file so you never paste URLs. Idempotent (`CREATE TABLE IF NOT EXISTS`); it
  creates missing tables but does **not** alter existing ones — for a schema change add an
  idempotent `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` to the relevant `db/*.sql` first.

- Verify changes with `npm run build`. The site is visually reviewed on **Vercel preview deploys**,
  not a long-running local server — don't ask the user to check a localhost URL.
- Use **Node 20** only (`.nvmrc` + `engines`). `@astrojs/vercel` v7 maps Node 20 → `nodejs20.x`;
  any other version falls back to the discontinued `nodejs18.x` and **breaks the Vercel deploy**.

## Architecture

- **Hybrid rendering**: every page is static by default. API routes opt out with
  `export const prerender = false` and run as Vercel functions.
- **Content lives in `src/data/`** — `content.ts` (copy), `nav.ts` (navigation), `seo.ts` (brand,
  SITE, contact, org JSON-LD). Edit copy here, not scattered in pages, when it's shared.
- **Layouts**: `BaseLayout.astro` (head/SEO/Nav/Footer/fonts) → `PageLayout.astro` (breadcrumb +
  title + lede + slot) → page.
- **Database**: `src/lib/db.ts` exposes `db()`, a pooled `@vercel/postgres` client that reads
  `POSTGRES_URL` **or** `DATABASE_URL`. Endpoints: `src/pages/api/contact.ts` (insert
  `contact_messages` + Resend email) and `api/sms-consent.ts` (insert `sms_consent`). Schemas +
  `migrate.sh` are in `db/`.

## Conventions

- **One typeface: Geist.** Both `font-sans` and `font-serif` (Tailwind) map to Geist. Don't add a
  serif/other font unless asked; headings are differentiated by size/weight, not family.
- **No em-dashes (—) in copy.** Use commas, colons, or periods.
- **Spacing is intentionally compact.** Section vertical padding is stepped down site-wide (sections
  are `~py-10 lg:py-12`, not `py-16`). Match that scale for new sections; don't reintroduce large
  gaps. Buttons/inputs/card interiors keep their smaller padding.
- **Images: use only assets the user provides** (in `public/`). Don't generate, substitute, or
  invent images *unless the user explicitly asks you to create one*. If a needed image is missing
  and they haven't asked you to make it, ask.
- **Hover treatment** for cards/images: lift (`hover:-translate-y-*`) + shadow, plus a shine-sweep
  overlay and a gentle image zoom — see `CareGrid.astro` for the canonical pattern; reuse it.
- **Styling** is Tailwind utilities; brand colours in `tailwind.config.mjs`, global/reveal/carousel
  CSS in `src/styles/global.css`. Reuse existing color tokens (`ever`, `clay`, `sand`, `sage`, …).
- **Blog tag pages** (`/blog/tag/<slug>/`, built per language from each post's `hashtags:`
  frontmatter): **a tag page is indexed once it lists 4 or more posts, and every indexed tag needs
  a hand-written intro** in `TAG_INTROS` (`src/data/tags.ts`). A listing has no prose of its own,
  so without an intro it is ~150 words all recycled from the articles it links to, which competes
  with them in search. Below the threshold a tag renders `noindex, follow` and leaves the sitemap;
  `follow` keeps link equity flowing to the articles. Tags cross the threshold on their own as
  posts are published, so **when one does, write its intro.** The threshold lives in
  `TAG_INDEX_MIN_POSTS` (`src/data/tagRules.mjs`), which is plain ESM precisely so the page code
  and `astro.config.mjs`'s sitemap filter share one definition. Change it there only.
  Avoid two tags that resolve to the same set of posts: their listings are duplicates of each
  other. `WorkplaceWellbeing` was dropped for exactly that reason (identical to `MenopauseAtWork`).
- **Commits**: scoped, imperative subject (`feat:`/`style:`/`fix:`/`chore:`), and end the message
  with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.

## Deploy workflow

- `main` → Vercel **Preview** (preview DB). `release` → **Production** (prod DB).
- Promote to prod by fast-forwarding: `git push origin main:release`.
- Env vars (`POSTGRES_URL`/`DATABASE_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL_TO`,
  `CONTACT_EMAIL_FROM`) are set per-environment in Vercel. All `.env*` files except `.env.example`
  are gitignored — never commit a connection string.
