// Blog tag rules shared by the site and the build config.
//
// Plain ESM on purpose. astro.config.mjs needs the indexing threshold to filter
// the sitemap, but it is loaded before the TypeScript sources resolve, so it
// cannot import src/data/tags.ts. Everything here is dependency-free and typed
// with JSDoc, which the Astro tsconfig picks up (`allowJs`), so src/data/tags.ts
// re-exports it rather than keeping a second copy in step by hand.

/**
 * A tag page is indexable once it lists this many posts.
 *
 * A listing with a single post has no content of its own: it repeats that
 * post's title, synopsis and cover and nothing else. Indexed, it competes with
 * the article itself for the same query, and the thin page can win. From two
 * posts up, the page groups something a reader cannot get from any one article,
 * which is a reason for it to exist in search.
 *
 * Below the threshold a tag page renders `noindex, follow` and stays out of the
 * sitemap: still browsable, still passing link equity to the articles, just not
 * a search result. Tags cross the line on their own as posts are published, so
 * this needs no upkeep.
 */
export const TAG_INDEX_MIN_POSTS = 2;

/**
 * Whether a tag listing this many posts should be indexed.
 *
 * @param {number} postCount posts carrying the tag, in one language
 * @returns {boolean}
 */
export function isTagIndexable(postCount) {
  return postCount >= TAG_INDEX_MIN_POSTS;
}

/**
 * URL slug for a tag: `FrozenShoulder` becomes `frozen-shoulder`, `HRLeadership`
 * becomes `hr-leadership`. Readable slugs beat a flattened `frozenshoulder`,
 * which search engines read as one long token.
 *
 * @param {string} tag CamelCase tag token, without the leading `#`
 * @returns {string}
 */
export function tagSlug(tag) {
  return (
    tag
      // An acronym followed by a word: HRLeadership -> HR-Leadership
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
      // A normal camel boundary: FrozenShoulder -> Frozen-Shoulder
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase()
  );
}
