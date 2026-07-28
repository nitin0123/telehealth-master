// Single source of truth for the site's navigation architecture.
// Used by both the desktop dropdowns and the mobile drawer.
//
// Structure only: labels and blurbs live in src/i18n/en.ts (and hi.ts), keyed by
// the `id`s below, so the same tree renders in either language. The comments name
// the English label for readability.

export interface NavChild {
  /** Key into `nav.links` in the i18n dictionaries */
  id: string;
  href: string;
}

export interface NavSection {
  /** Key into `nav.sections` in the i18n dictionaries */
  id: string;
  /** When set, the item renders as a plain link instead of a dropdown */
  href?: string;
  children?: NavChild[];
}

export const nav: NavSection[] = [
  {
    id: 'symptoms', // Understand Your Symptoms
    children: [
      { id: 'perimenopause101', href: '/understand-your-symptoms/perimenopause-101/' },
      { id: 'symptomChecker', href: '/understand-your-symptoms/symptom-checker/' },
    ],
  },
  {
    id: 'care', // Get Care
    children: [
      { id: 'howItWorks', href: '/get-care/how-it-works/' },
      { id: 'ourSpecialists', href: '/get-care/our-specialists/' },
      { id: 'bookConsultation', href: '/coming-soon/' },
      { id: 'pricing', href: '/get-care/pricing/' },
    ],
  },
  {
    id: 'events', // Events
    children: [
      { id: 'eventsUpcoming', href: '/events/upcoming/' },
      { id: 'eventsOnDemand', href: '/events/on-demand/' },
      { id: 'eventsForCorporates', href: '/events/for-corporates/' },
    ],
  },
  {
    id: 'community', // Community
    children: [
      { id: 'communityJoin', href: '/community/join/' },
      { id: 'storiesOfReset', href: '/community/stories-of-reset/' },
      { id: 'faqs', href: '/community/faqs/' },
    ],
  },
  {
    id: 'blog', // Blog
    href: '/blog/',
  },
  {
    id: 'about', // About
    children: [
      { id: 'founders', href: '/about/' },
      { id: 'ourStory', href: '/about/our-story/' },
      { id: 'ourTeam', href: '/about/our-team/' },
      { id: 'inThePress', href: '/about/in-the-press/' },
      { id: 'workplaceWellness', href: '/about/workplace-wellness/' },
    ],
  },
];

// Booking is pre-launch. All "Book a Consultation" CTAs point to the Coming Soon page.
// When ready, switch this back to '/get-care/book-a-consultation/'.
export const BOOK_HREF = '/coming-soon/';

/** Footer link columns, in order. Keys are section ids from `nav` above. */
export const FOOTER_COLS = ['symptoms', 'care', 'community', 'about'];
