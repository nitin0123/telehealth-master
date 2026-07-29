import { readFile } from 'node:fs/promises';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';
// Plain ESM so this config and the site share one definition of the tag
// indexing rule; see the module for why it is not TypeScript.
import { isTagIndexable, tagSlug } from './src/data/tagRules.mjs';

// Map each blog slug to its publishedAt date so the sitemap can carry an
// accurate <lastmod> for posts; other pages fall back to the build date.
// Recursive: Hindi posts live in src/content/blog/hi/ and share their English
// twin's slug, so both languages of a post get the same real <lastmod>.
const blogDir = fileURLToPath(new URL('./src/content/blog', import.meta.url));
const blogPosts = readdirSync(blogDir, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const raw = readFileSync(`${blogDir}/${f}`, 'utf8');
    const date = raw.match(/^publishedAt:\s*([0-9-]+)/m);
    const tags = raw.match(/^hashtags:\s*\[(.*?)\]/m);
    return {
      // 'hi/foo.md' and 'foo.md' both key on 'foo'; the sitemap looks the slug
      // up without its locale prefix.
      slug: f.replace(/\.md$/, '').replace(/^hi\//, ''),
      hindi: f.startsWith('hi/'),
      lastmod: date ? new Date(date[1]).toISOString() : undefined,
      tags: tags ? tags[1].split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
  });

const blogLastmod = Object.fromEntries(blogPosts.map((p) => [p.slug, p.lastmod]));
const BUILD_DATE = new Date().toISOString();

// Count each tag per language, since the two editions are listed separately.
const tagCounts = new Map();
for (const post of blogPosts) {
  for (const tag of post.tags) {
    const key = `${post.hindi ? '/hindi' : ''}/blog/tag/${tagSlug(tag)}/`;
    tagCounts.set(key, (tagCounts.get(key) ?? 0) + 1);
  }
}
const THIN_TAG_PATHS = [...tagCounts]
  .filter(([, count]) => !isTagIndexable(count))
  .map(([path]) => path);

// Pre-launch pages that render `noindex`, so they're kept out of the sitemap.
// `/get-care/book-a-consultation` is noindex while booking is pre-launch (all
// CTAs point at `/coming-soon`); drop it from this list when booking opens.
const NOINDEX_PATHS = ['/coming-soon', '/get-care/book-a-consultation', ...THIN_TAG_PATHS];

// Inline a binary file as a base64 string at build time:
//
//   import report from '../../../public/reports/some.pdf?base64';
//
// Used by /api/corporate-readiness so the report email carries the PDF's real
// bytes. The obvious alternative, handing Resend a URL to fetch, breaks on
// every environment that isn't public: preview deploys sit behind Vercel
// deployment protection and 302 to an SSO login, so the recipient receives the
// login page saved as a .pdf. Bundling the bytes removes the network entirely.
function base64Asset() {
  const SUFFIX = '?base64';
  return {
    name: 'base64-asset',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!source.endsWith(SUFFIX) || !importer) return null;
      const target = fileURLToPath(new URL(source.slice(0, -SUFFIX.length), pathToFileURL(importer)));
      return `${target}${SUFFIX}`;
    },
    async load(id) {
      if (!id.endsWith(SUFFIX)) return null;
      const data = await readFile(id.slice(0, -SUFFIX.length));
      return `export default ${JSON.stringify(data.toString('base64'))};`;
    },
  };
}

// https://astro.build/config
export default defineConfig({
  vite: { plugins: [base64Asset()] },
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
