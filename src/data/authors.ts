// Article author identities for the BlogPosting JSON-LD on blog posts.
//
// Menopause content is YMYL ("your money or your life"), where search engines
// weigh an *identifiable* author entity far more heavily than a bare name
// string: a `Person` with a job title, a link to a real bio page and a photo
// is a much stronger expertise signal than text alone. So a post's `author:`
// frontmatter is resolved against this registry into a full schema.org node.
//
// Keys are the exact `author:` values used in src/content/blog/**.md, in both
// languages, so a Hindi post resolves to the same identity as its English
// twin. Anything unmatched falls back to the publishing organisation, which
// still carries a URL to the team page rather than being a naked string.
//
// Adding a person: give them a bio page under src/pages/[...locale]/about/
// first, so `url` resolves to something real. A Person node pointing at a
// page that doesn't exist is worse than no Person node at all.
import type { Lang } from '../i18n';
import { BRAND, SITE } from './seo';

interface AuthorProfile {
  /** Canonical display name. Identical in both languages, by design. */
  name: string;
  /** Bio page path, unlocalised: localizePath() adds the /hindi prefix. */
  path: string;
  jobTitle: Record<Lang, string>;
  description: Record<Lang, string>;
  /** Portrait under public/, used as the Person's image. */
  image?: string;
  /**
   * Authoritative profiles elsewhere (personal LinkedIn, Instagram, an
   * author page). Left empty until we have URLs that are unambiguously the
   * person rather than the brand: a wrong sameAs merges two entities in
   * Google's knowledge graph and is painful to undo.
   */
  sameAs?: string[];
}

/** Mirrors the knowsAbout on the bio pages' own Person schema. */
const KNOWS_ABOUT = ['Menopause', 'Perimenopause', "Women's midlife health"];

const PROFILES: AuthorProfile[] = [
  {
    name: 'Reshma Tiwari',
    path: '/about/reshma-tiwari/',
    jobTitle: { en: 'Co-founder', hi: 'सह-संस्थापक' },
    description: {
      en: "Certified menopause coach, speaker and women's wellness advocate.",
      hi: 'प्रमाणित मेनोपॉज़ कोच, वक्ता और महिला स्वास्थ्य की पैरोकार।',
    },
    image: '/reshma.jpeg',
  },
  {
    name: 'Swati Singh',
    path: '/about/swati-singh/',
    jobTitle: { en: 'Co-founder', hi: 'सह-संस्थापक' },
    description: {
      en: "Author of Menopause & Me, menopause educator, speaker and women's wellness advocate.",
      hi: 'Menopause & Me की लेखिका, मेनोपॉज़ शिक्षिका, वक्ता और महिला स्वास्थ्य की पैरोकार।',
    },
    image: '/swati.jpeg',
  },
];

/**
 * Every `author:` string that maps to a profile, including the Hindi spelling
 * of each name, so both language editions of a post share one author entity.
 */
const BY_NAME = new Map<string, AuthorProfile>([
  ...PROFILES.map((p) => [p.name, p] as const),
  // Hindi posts spell the names in Devanagari.
  ['रेशमा तिवारी', PROFILES[0]],
  ['स्वाति सिंह', PROFILES[1]],
]);

/**
 * Bio page path for a named author, or null when the byline is the editorial
 * team. Lets the visible byline link to the same page the JSON-LD points at:
 * Google wants structured data corroborated by on-page content.
 */
export function authorPath(author: string): string | null {
  return BY_NAME.get(author.trim())?.path ?? null;
}

/**
 * schema.org node for a post's author.
 *
 * @param author  the raw `author:` frontmatter value
 * @param lang    the post's language
 * @param toAbs   maps an unlocalised site path to an absolute, localised URL
 */
export function authorNode(author: string, lang: Lang, toAbs: (path: string) => string) {
  const profile = BY_NAME.get(author.trim());

  // Unattributed posts (the editorial team) stay an Organization: claiming a
  // named human wrote something they didn't is the one thing worse for trust
  // than a generic byline.
  if (!profile) {
    return {
      '@type': 'Organization',
      name: author,
      url: toAbs('/about/our-team/'),
      parentOrganization: { '@type': 'Organization', name: BRAND, url: SITE.url },
    };
  }

  return {
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.jobTitle[lang],
    description: profile.description[lang],
    url: toAbs(profile.path),
    ...(profile.image ? { image: `${SITE.url}${profile.image}` } : {}),
    ...(profile.sameAs?.length ? { sameAs: profile.sameAs } : {}),
    worksFor: { '@type': 'Organization', name: BRAND, url: SITE.url },
    knowsAbout: KNOWS_ABOUT,
  };
}
