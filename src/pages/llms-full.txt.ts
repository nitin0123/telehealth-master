// llms-full.txt: the full-text companion to llms.txt.
//
// Generated from the actual content collection at build time rather than
// hand-written, so it cannot drift out of date the way llms.txt did. Answer
// engines that want the substance of the site, rather than a map of it, fetch
// this instead of crawling every page.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, BRAND } from '../data/seo';
import { en } from '../i18n/en';

/** Strip the markdown that adds nothing for a plain-text reader. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\n/, '')            // frontmatter
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')        // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')     // links keep their text
    .replace(/^#{1,6}\s*/gm, '')                 // heading markers
    .replace(/[*_`>]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = async () => {
  // English only: the Hindi posts are translations of the same articles, and
  // duplicating them here would double the file for no extra information.
  const posts = (await getCollection('blog', (p) => !p.id.startsWith('hi/'))).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );

  const faqs = en.content.faqs ?? [];
  const ww = en.pages.workplaceWellness;

  const parts: string[] = [
    `# ${BRAND}: full text`,
    '',
    `> ${en.seo.defaultDescription}`,
    `> Source: ${SITE.url} | Generated at build time from the site's own content.`,
    '',
    '## Frequently asked questions',
    '',
    ...faqs.flatMap((f: { q: string; a: string }) => [`### ${f.q}`, '', f.a, '']),
    '## Workplace wellness for employers',
    '',
    ww.intro,
    '',
    `### ${ww.businessCase.heading}`,
    '',
    ww.businessCase.body,
    '',
    ...ww.businessCase.stats.map((s: { figure: string; text: string }) => `- ${s.figure}: ${s.text}`),
    '',
    `### ${ww.programme.heading}`,
    '',
    ...ww.programme.tiers.map((t: { tier: string; h: string; p: string }) => `- ${t.tier}, ${t.h}: ${t.p}`),
    '',
    'Sources for the statistics above:',
    ...ww.sources.map((s: { text: string; href?: string }) => `- ${s.text}${s.href ? ` ${s.href}` : ''}`),
    '',
    '## Articles',
    '',
  ];

  for (const post of posts) {
    const { title, synopsis, publishedAt, author } = post.data;
    parts.push(
      `### ${title}`,
      '',
      `URL: ${SITE.url}/blog/${post.slug}/`,
      `Published: ${publishedAt.toISOString().slice(0, 10)} | Author: ${author}`,
      '',
      synopsis ?? '',
      '',
      toPlainText(post.body),
      ''
    );
    for (const f of post.data.faq ?? []) parts.push(`Q: ${f.q}`, `A: ${f.a}`, '');
  }

  return new Response(parts.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
