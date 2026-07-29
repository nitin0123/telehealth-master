// Content collections. Blog posts live in src/content/blog/*.md — adding a
// new post is just a new markdown file; /blog and the post template pick it
// up automatically at build time.
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    /** Optional secondary line shown under the title */
    subtitle: z.string().optional(),
    /** One-liner used on the /blog cards and as the meta description */
    synopsis: z.string(),
    /**
     * One name, or several for a co-authored post:
     *   author: Reshma Tiwari
     *   author: [Reshma Tiwari, Swati Singh]
     * Names are resolved against src/data/authors.ts into Person schema.
     */
    author: z.union([z.string(), z.array(z.string())]).default('ResetWell Plus Editorial Team'),
    publishedAt: z.coerce.date(),
    /** Optional. Set when a post is materially revised; drives dateModified. */
    updatedAt: z.coerce.date().optional(),
    /** Optional card/OG image path under public/ (user-provided assets only) */
    cover: z.string().optional(),
    /** Comma-separated SEO/AEO keyword phrases for the meta tag + JSON-LD */
    keywords: z.string().optional(),
    /**
     * Short <title> override for search results. Set this when the article
     * headline plus the brand suffix would exceed ~60 chars and truncate in
     * SERPs. Keep the primary keyword in it.
     */
    metaTitle: z.string().optional(),
    /** Q&As rendered at the end of the post + emitted as FAQPage JSON-LD */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    /**
     * URL of the LinkedIn article this post was also published as. Emitted as
     * `sameAs` on the BlogPosting so search engines treat the two as one work
     * with this site as the canonical home, rather than as duplicate content.
     * English posts only: a Hindi translation is a different work, not the
     * same article at another URL.
     */
    linkedin: z.string().url().optional(),
    /**
     * Topic tags shown as a chip row under the post, written without the `#`
     * (the template adds it). Kept in English on both language editions, the
     * way the LinkedIn originals tag them: a hashtag reads as a token rather
     * than prose, and splitting them per language would fragment the topic.
     */
    hashtags: z.array(z.string()).optional(),
    /** Set true to keep a post out of the index and sitemap while drafting */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
