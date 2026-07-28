// Shared types for the translation dictionaries.
//
// Kept in their own module so `hi.ts` can be typed against `en.ts` without the
// two files (and `index.ts`) importing each other in a cycle.
import type { en } from './en';

/** The full dictionary shape. English is the source of truth for the keys. */
export type Dict = typeof en;

/**
 * Every key optional, recursively. Hindi is typed as a `DeepPartial<Dict>` so
 * translations can land page by page: anything not yet translated simply falls
 * back to the English string at build time (see `dictionaries` in ./index.ts).
 * Arrays are treated as leaves and replaced wholesale, never merged item by item.
 */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Copy for one navigation section (the top-level bar/drawer entries). */
export interface SectionCopy {
  label: string;
  /** Shorter label for the desktop bar, where horizontal space is tight */
  short?: string;
}

/** Copy for one navigation link (a dropdown/drawer child). */
export interface LinkCopy {
  label: string;
  /** Secondary line shown under the label in the desktop dropdown */
  blurb?: string;
  /** Shorter label for the footer columns */
  short?: string;
}
