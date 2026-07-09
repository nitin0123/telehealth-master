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
    author: z.string().default('ResetWell Plus Editorial Team'),
    publishedAt: z.coerce.date(),
    /** Optional card/OG image path under public/ (user-provided assets only) */
    cover: z.string().optional(),
    /** Comma-separated SEO/AEO keyword phrases for the meta tag + JSON-LD */
    keywords: z.string().optional(),
    /** Set true to keep a post out of the index and sitemap while drafting */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
