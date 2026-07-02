# Aria — Midlife & Menopause Care (Astro)

A polished, mobile-first marketing site for a women's midlife & menopause care brand.
Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com). Purple-and-white
theme, direct-pay (no insurance), full navigation architecture, and working symptom-checker /
booking / community flows.

## Quick start

```bash
npm install      # install dependencies
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # preview the production build locally
```

Requires Node.js 18.20+ or 20.3+ (any current LTS works).

## Project structure

```
src/
  data/
    nav.ts          # navigation architecture (single source of truth)
    content.ts      # copy: stats, care needs, steps, specialists, testimonials, FAQs, events
  layouts/
    BaseLayout.astro  # <head>, Nav, Footer, scroll-reveal script
    PageLayout.astro  # inner-page wrapper: breadcrumb + title + lede + slot
  components/
    Nav.astro Announcement.astro Footer.astro
    Hero.astro ValueStrip.astro CareGrid.astro Expertise.astro
    Testimonials.astro HowItWorks.astro EventsCommunity.astro Faq.astro FinalCta.astro
    SymptomChecker.astro BookingForm.astro JoinForm.astro
    SpecialistsGrid.astro EventsList.astro
  pages/
    index.astro
    understand-your-symptoms/ {perimenopause-101, symptom-checker, knowledge-centre}
    get-care/ {how-it-works, our-specialists, book-a-consultation, pricing}
    events/ {upcoming, on-demand, for-corporates}
    community/ {join, stories-of-reset, faqs}
    about/ {our-story, our-team, in-the-press, workplace-wellness}
public/
  favicon.svg
_prototype-html/    # the original single-file HTML prototype, for reference
```

Astro uses **file-based routing**: each `.astro` file under `src/pages` becomes a URL
(e.g. `src/pages/get-care/pricing.astro` → `/get-care/pricing`).

## Editing content

Most copy lives in `src/data/content.ts` and `src/data/nav.ts`. Change it there and it updates
everywhere it's used. Page-specific copy lives in the relevant file under `src/pages`.

## Theming

Brand colors and fonts are defined in `tailwind.config.mjs` (the `colors` and `fontFamily` keys).
Adjusting a color there re-skins the whole site. Global styles and the reveal/carousel CSS live in
`src/styles/global.css`.

## Images

Colored blocks labelled "Photo" / "Portrait" are placeholders. Drop real images into `public/`
(or `src/assets/` and use Astro's `<Image />`), then replace the placeholder `<div>`s.

## Hooking up a backend

The forms are wired for it. Each has a clearly marked `TODO` in its `<script>`:

- `src/components/BookingForm.astro` — booking submit
- `src/components/JoinForm.astro` and `EventsCommunity.astro` — community sign-up

To accept submissions server-side, add Astro **API routes** (e.g. `src/pages/api/book.ts`) and a
server adapter (`@astrojs/node`, Vercel, Netlify, etc.), then `fetch('/api/book', …)` from the form.
Or point the forms at any third-party endpoint (Calendly/Cal.com for booking, a CRM, an email
provider, etc.). See README "Hooking up a backend" notes inline in each component.

## Deploying

`npm run build` outputs a static site to `./dist` that can be hosted anywhere
(Netlify, Vercel, Cloudflare Pages, S3, GitHub Pages). Add API routes + an adapter only if you
need server-side form handling.
