// Blog topic tags.
//
// A post declares its tags in frontmatter as CamelCase tokens without the `#`
// (see src/content/config.ts). Those tokens are the display form; this module
// turns them into URL slugs and back into hrefs.
//
// Tags stay in English on the Hindi edition, but a tag URL is still localised:
// /blog/tag/frozen-shoulder/ lists the English posts, and its Hindi twin
// /hindi/blog/tag/frozen-shoulder/ lists the Hindi ones. Same tag, same slug,
// each language listing its own articles.
import type { CollectionEntry } from 'astro:content';
import { localizePath, type Lang } from '../i18n';

/**
 * A tag page is indexable once it lists this many posts.
 *
 * A listing with a single post has no content of its own: it repeats that
 * post's title, synopsis and cover and nothing else. Indexed, it competes with
 * the article itself for the same query, and the thin page can win. From two
 * posts up, the page groups things a reader cannot get from any one article,
 * which is a reason for it to exist in search.
 *
 * Below the threshold a tag page renders `noindex, follow` and stays out of the
 * sitemap: still browsable, still passing link equity to the articles, just not
 * a search result. Tags cross the line on their own as posts are published, so
 * this needs no upkeep.
 *
 * Enforced in two places that must agree: the `noindex` prop in
 * src/pages/[...locale]/blog/tag/[tag].astro, and the sitemap filter in
 * astro.config.mjs.
 */
export const TAG_INDEX_MIN_POSTS = 2;

/** Whether a tag listing this many posts should be indexed. */
export function isTagIndexable(postCount: number): boolean {
  return postCount >= TAG_INDEX_MIN_POSTS;
}

/**
 * URL slug for a tag: `FrozenShoulder` becomes `frozen-shoulder`, `HRLeadership`
 * becomes `hr-leadership`. Readable slugs beat a flattened `frozenshoulder`,
 * which search engines read as one long token.
 */
export function tagSlug(tag: string): string {
  return tag
    // An acronym followed by a word: HRLeadership -> HR-Leadership
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    // A normal camel boundary: FrozenShoulder -> Frozen-Shoulder
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/** Localised URL for a tag's listing page. */
export function tagHref(tag: string, lang: Lang): string {
  return localizePath(`/blog/tag/${tagSlug(tag)}/`, lang);
}

/**
 * Every tag used by the given posts, each with its slug, the display form and
 * the posts carrying it, sorted by how many posts use it and then A to Z.
 *
 * Display form is taken from the first post that uses the tag: two posts
 * spelling one tag differently would otherwise produce two entries with the
 * same slug and collide in getStaticPaths.
 */
export function collectTags(posts: CollectionEntry<'blog'>[]) {
  const bySlug = new Map<string, { slug: string; label: string; posts: CollectionEntry<'blog'>[] }>();

  for (const post of posts) {
    for (const tag of post.data.hashtags ?? []) {
      const slug = tagSlug(tag);
      const entry = bySlug.get(slug) ?? { slug, label: tag, posts: [] };
      entry.posts.push(post);
      bySlug.set(slug, entry);
    }
  }

  return [...bySlug.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.label.localeCompare(b.label)
  );
}
