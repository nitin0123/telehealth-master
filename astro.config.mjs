import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  // Production URL — powers canonical links, sitemap and Open Graph URLs.
  site: 'https://www.resetwellplus.com',
  // Hybrid: every page is prerendered to static HTML by default; only routes
  // that opt out with `export const prerender = false` (e.g. /api/contact)
  // run as Vercel serverless functions.
  output: 'hybrid',
  adapter: vercel(),
  integrations: [
    tailwind(),
    sitemap({
      // Pre-launch pages shouldn't be indexed or listed in the sitemap.
      filter: (page) => !page.includes('/coming-soon'),
    }),
  ],
});
