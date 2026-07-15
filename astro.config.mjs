import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// Map each blog slug to its publishedAt date so the sitemap can carry an
// accurate <lastmod> for posts; other pages fall back to the build date.
const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
const blogLastmod = Object.fromEntries(
  readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const m = readFileSync(`${blogDir}/${f}`, 'utf8').match(/^publishedAt:\s*([0-9-]+)/m);
      return [f.replace(/\.md$/, ''), m ? new Date(m[1]).toISOString() : undefined];
    })
);
const BUILD_DATE = new Date().toISOString();

// Pre-launch pages that render `noindex`, so they're kept out of the sitemap.
// `/get-care/book-a-consultation` is noindex while booking is pre-launch (all
// CTAs point at `/coming-soon`); drop it from this list when booking opens.
const NOINDEX_PATHS = ['/coming-soon', '/get-care/book-a-consultation'];

// https://astro.build/config
export default defineConfig({
  // Production URL — powers canonical links, sitemap and Open Graph URLs.
  site: 'https://www.resetwellplus.com',
  // Hybrid: every page is prerendered to static HTML by default; only routes
  // that opt out with `export const prerender = false` (e.g. /api/contact)
  // run as Vercel serverless functions.
  output: 'hybrid',
  adapter: vercel(),
  // @astrojs/sitemap writes /sitemap-index.xml, but many crawlers and SEO
  // tools blindly request /sitemap.xml; give them a real redirect.
  redirects: {
    '/sitemap.xml': '/sitemap-index.xml',
  },
  integrations: [
    tailwind(),
    sitemap({
      // Pages that render `noindex` must not appear in the sitemap: listing a
      // noindex URL is contradictory and is flagged by SEO crawlers. Keep this
      // in sync with any page passing `noindex` to BaseLayout/PageLayout.
      filter: (page) => !NOINDEX_PATHS.some((p) => page.includes(p)),
      // Add a <lastmod> freshness signal: real publish date for blog posts,
      // build date for everything else.
      serialize(item) {
        const slug = item.url.match(/\/blog\/([^/]+)\/?$/)?.[1];
        item.lastmod = (slug && blogLastmod[slug]) || BUILD_DATE;
        return item;
      },
    }),
  ],
});
