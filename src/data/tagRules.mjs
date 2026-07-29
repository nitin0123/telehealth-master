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
 * A tag listing has no prose of its own: it is an H1, a count and post cards
 * lifted from the articles. Measured on the built output, a two-post listing
 * came to 83 to 111 words, all of it recycled, against 674 to 1545 for a real
 * article. That is a thin page, and indexed it competes with the very articles
 * it links to. Four posts puts a listing near 154 words, and paired with the
 * hand-written intro in TAG_INTROS (src/data/tags.ts) the page carries roughly
 * 300 to 450 words with a third of it unique. That is worth indexing.
 *
 * Below the threshold a tag page renders `noindex, follow` and stays out of the
 * sitemap: still browsable, still passing link equity to the articles, just not
 * a search result.
 *
 * Tags cross this line on their own as posts are published. When one does,
 * write it an intro, or it goes into the index as the thin page this threshold
 * exists to keep out.
 */
export const TAG_INDEX_MIN_POSTS = 4;

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
