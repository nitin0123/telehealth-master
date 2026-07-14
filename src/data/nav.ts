// Single source of truth for the site's navigation architecture.
// Used by both the desktop dropdowns and the mobile drawer.

export interface NavChild {
  label: string;
  href: string;
  blurb?: string;
}

export interface NavSection {
  label: string;
  /** Shorter label used in the desktop bar where space is tight */
  shortLabel?: string;
  /** When set, the item renders as a plain link instead of a dropdown */
  href?: string;
  children?: NavChild[];
}

export const nav: NavSection[] = [
  {
    label: 'Understand Your Symptoms',
    shortLabel: 'Understand Symptoms',
    children: [
      { label: 'Perimenopause 101', href: '/understand-your-symptoms/perimenopause-101', blurb: 'Start here: the basics' },
      { label: 'Symptom Checker', href: '/understand-your-symptoms/symptom-checker', blurb: '2-min self-assessment' },
    ],
  },
  {
    label: 'Get Care',
    children: [
      { label: 'How It Works', href: '/get-care/how-it-works' },
      { label: 'Our Specialists', href: '/get-care/our-specialists' },
      { label: 'Book a Consultation', href: '/coming-soon' },
      { label: 'Pricing (₹)', href: '/get-care/pricing' },
    ],
  },
  {
    label: 'Events',
    children: [
      { label: 'Upcoming', href: '/events/upcoming' },
      { label: 'On Demand', href: '/events/on-demand' },
      { label: 'For Corporates', href: '/events/for-corporates' },
    ],
  },
  {
    label: 'Community',
    children: [
      { label: 'Join', href: '/community/join' },
      { label: 'Stories of Reset', href: '/community/stories-of-reset' },
      { label: 'FAQs', href: '/community/faqs' },
    ],
  },
  {
    label: 'Blog',
    href: '/blog',
  },
  {
    label: 'About',
    children: [
      { label: 'Meet the Founders', href: '/about' },
      { label: 'Our Story', href: '/about/our-story' },
      { label: 'Our Team', href: '/about/our-team' },
      { label: 'In The Press', href: '/about/in-the-press' },
      { label: 'Workplace Wellness', href: '/about/workplace-wellness' },
    ],
  },
];

// Booking is pre-launch. All "Book a Consultation" CTAs point to the Coming Soon page.
// When ready, switch this back to '/get-care/book-a-consultation'.
export const BOOK_HREF = '/coming-soon';
