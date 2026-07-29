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

// The indexing threshold and the slug function live in plain ESM so that
// astro.config.mjs, which is loaded before the TypeScript sources resolve, can
// import the same definitions for its sitemap filter. Re-exported here so page
// code has a single tag module to import.
export { TAG_INDEX_MIN_POSTS, isTagIndexable, tagSlug } from './tagRules.mjs';

import { tagSlug } from './tagRules.mjs';

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
