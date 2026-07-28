// Locale plumbing for the bilingual (English + Hindi) site.
//
// Language is derived from the URL: anything under /hindi/ is Hindi, everything
// else is English. Components call `useTranslations(Astro.url)` and read copy off
// the returned dictionary, so no `lang` prop has to be threaded through the tree.
import { en } from './en';
import { hi } from './hi';
import type { DeepPartial, Dict } from './types';

export type { Dict, LinkCopy, SectionCopy } from './types';

export type Lang = 'en' | 'hi';

export const DEFAULT_LANG: Lang = 'en';

/** URL prefix for the Hindi site. */
export const HI_PREFIX = '/hindi';

/** <html lang> and hreflang codes. */
export const LOCALE: Record<Lang, string> = { en: 'en-IN', hi: 'hi-IN' };

/** og:locale codes. */
export const OG_LOCALE: Record<Lang, string> = { en: 'en_IN', hi: 'hi_IN' };

/** Label shown on the language toggle, in the language being switched TO. */
export const LANG_LABEL: Record<Lang, string> = { en: 'English', hi: 'हिंदी' };

/**
 * Compact form used in the header bar, where every pixel competes with the
 * nav items. The drawer uses the full LANG_LABEL.
 */
export const LANG_SHORT: Record<Lang, string> = { en: 'EN', hi: 'हिं' };

/**
 * Path prefixes that exist in English only.
 *
 * Every page under src/pages/[...locale]/ builds a Hindi twin automatically, so
 * this is the short list of exceptions rather than an inventory of what is
 * translated. `localizePath` leaves these pointing at the English URL, and the
 * language toggle and hreflang tags are omitted on them, so a partially
 * translated site never links to a 404.
 *
 * `/404`: one 404 page is served for unknown URLs in both languages, so a
 * language toggle there would point at a page that does not exist. Every blog
 * post now has a Hindi twin, so /blog/ came off this list.
 *
 * `/about/workplace-wellness/readiness-score`: the corporate assessment is an
 * English-only tool for HR and CXO audiences, and its page file lives outside
 * src/pages/[...locale]/ so no Hindi twin is built.
 */
export const EN_ONLY: readonly string[] = ['/404', '/about/workplace-wellness/readiness-score'];

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/** Leading and trailing slash, no query or hash, for stable comparisons. */
function norm(path: string): string {
  const bare = path.split('#')[0].split('?')[0];
  const lead = bare.startsWith('/') ? bare : `/${bare}`;
  return lead.endsWith('/') ? lead : `${lead}/`;
}

/** True for paths this module should rewrite (site-internal, no query/hash). */
function isInternal(path: string): boolean {
  return path.startsWith('/') && !path.includes('#') && !path.includes('?');
}

export function langFromUrl(url: URL | string): Lang {
  const path = norm(typeof url === 'string' ? url : url.pathname);
  return path.startsWith(`${HI_PREFIX}/`) ? 'hi' : 'en';
}

/** Drop the /hindi prefix: '/hindi/get-care/' becomes '/get-care/'. */
export function stripLang(path: string): string {
  const p = norm(path);
  return p.startsWith(`${HI_PREFIX}/`) ? p.slice(HI_PREFIX.length) : p;
}

/** True when the given path (in either language) has a Hindi version. */
export function hasHindi(path: string): boolean {
  const base = stripLang(path);
  return !EN_ONLY.some((prefix) => base.startsWith(prefix));
}

/**
 * Rewrite an internal href for `lang`. Falls back to the English URL for pages
 * that are English-only, so links auto-upgrade as those pages are translated.
 * External links, anchors and mailto:/tel: hrefs pass through untouched.
 */
export function localizePath(path: string, lang: Lang): string {
  if (!isInternal(path)) return path;
  const base = stripLang(path);
  if (lang === 'en' || !hasHindi(base)) return base;
  return `${HI_PREFIX}${base}`;
}

/**
 * The same page in the other language, or null when there is no counterpart.
 * Used by the language toggle and the hreflang tags.
 */
export function alternatePath(url: URL | string): string | null {
  const path = typeof url === 'string' ? url : url.pathname;
  if (!hasHindi(path)) return null;
  const base = stripLang(path);
  return langFromUrl(path) === 'hi' ? base : `${HI_PREFIX}${base}`;
}

/**
 * `getStaticPaths` for every page under src/pages/[...locale]/.
 *
 * The rest parameter collapses when undefined, so one page file builds both
 * URLs: `/terms/` for English and `/hindi/terms/` for Hindi. That keeps the two
 * languages on a single source file instead of a mirrored tree that would have
 * to be kept structurally in sync by hand.
 */
export function localePaths() {
  return [{ params: { locale: undefined } }, { params: { locale: HI_PREFIX.slice(1) } }];
}

// ---------------------------------------------------------------------------
// Dictionaries
// ---------------------------------------------------------------------------

/** Recursively overlay `over` onto `base`. Arrays are replaced, not merged. */
function merge<T>(base: T, over: DeepPartial<T>): T {
  const out = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(over ?? {})) {
    if (value === undefined) continue;
    const current = out[key];
    const bothPlainObjects =
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      current !== null &&
      typeof current === 'object' &&
      !Array.isArray(current);
    out[key] = bothPlainObjects ? merge(current, value as DeepPartial<unknown>) : value;
  }
  return out as T;
}

/** English, plus Hindi layered over English so untranslated keys still render. */
export const dictionaries: Record<Lang, Dict> = {
  en,
  hi: merge(en, hi),
};

/** Copy for the current page. Pass `Astro.url` (or an explicit language). */
export function useTranslations(source: URL | string | Lang): Dict {
  const lang = source === 'en' || source === 'hi' ? source : langFromUrl(source);
  return dictionaries[lang];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fill {placeholders} in a string: fmt(t.nav.brandHome, { brand: WORDMARK }). */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => String(vars[key] ?? match));
}

/**
 * Look up navigation copy by id, failing the build (rather than rendering
 * `undefined`) when src/data/nav.ts gains an id with no dictionary entry.
 */
export function sectionCopy(t: Dict, id: string) {
  const copy = t.nav.sections[id];
  if (!copy) throw new Error(`i18n: no nav section copy for "${id}" (add it to src/i18n/en.ts)`);
  return copy;
}

export function linkCopy(t: Dict, id: string) {
  const copy = t.nav.links[id];
  if (!copy) throw new Error(`i18n: no nav link copy for "${id}" (add it to src/i18n/en.ts)`);
  return copy;
}
