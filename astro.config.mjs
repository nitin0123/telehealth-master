import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // Production URL — powers canonical links, sitemap and Open Graph URLs.
  site: 'https://www.resetwellplus.com',
  integrations: [
    tailwind(),
    sitemap({
      // Pre-launch pages shouldn't be indexed or listed in the sitemap.
      filter: (page) => !page.includes('/coming-soon'),
    }),
  ],
});
