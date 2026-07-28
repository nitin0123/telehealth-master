// English copy: the source of truth for every user-facing string on the site.
//
// Keys are namespaced by area (seo.*, nav.*, footer.*, common.*). `hi.ts` mirrors
// this shape; anything missing there falls back to the English string here, so a
// half-translated key never renders as blank.
//
// House style carries into every language: no em-dashes.
import type { LinkCopy, SectionCopy } from './types';

/** Top-level navigation sections. Keys match the `id`s in src/data/nav.ts. */
const navSections: Record<string, SectionCopy> = {
  symptoms: { label: 'Understand Your Symptoms', short: 'Understand Symptoms' },
  care: { label: 'Get Care' },
  events: { label: 'Events' },
  community: { label: 'Community' },
  blog: { label: 'Blog' },
  about: { label: 'About' },
};

/** Navigation links inside the sections. Keys match the `id`s in src/data/nav.ts. */
const navLinks: Record<string, LinkCopy> = {
  perimenopause101: { label: 'Perimenopause 101', blurb: 'Start here: the basics' },
  symptomChecker: { label: 'Symptom Checker', blurb: '2-min self-assessment' },
  howItWorks: { label: 'How It Works' },
  ourSpecialists: { label: 'Our Specialists' },
  bookConsultation: { label: 'Book a Consultation' },
  pricing: { label: 'Pricing (₹)', short: 'Pricing' },
  eventsUpcoming: { label: 'Upcoming' },
  eventsOnDemand: { label: 'On Demand' },
  eventsForCorporates: { label: 'For Corporates' },
  communityJoin: { label: 'Join' },
  storiesOfReset: { label: 'Stories of Reset' },
  faqs: { label: 'FAQs' },
  founders: { label: 'Meet the Founders' },
  ourStory: { label: 'Our Story' },
  ourTeam: { label: 'Our Team' },
  inThePress: { label: 'In The Press' },
  workplaceWellness: { label: 'Workplace Wellness' },
};

export const en = {
  seo: {
    defaultTitle: 'ResetWell Plus: Online Menopause & Perimenopause Care in India',
    defaultDescription:
      "ResetWell Plus is India's expert-led platform for perimenopause and menopause. Consult a menopause specialist online, check your symptoms, and get a personalised treatment plan.",
    ogImageAlt: "ResetWell Plus: India's expert-led Menopause and Perimenopause care",
    homeKeywords:
      'menopause care India, perimenopause treatment India, online gynaecologist consultation India, menopause specialist India, HRT India',
  },

  nav: {
    sections: navSections,
    links: navLinks,
    home: 'Home',
    theBook: 'The Book',
    contact: 'Contact Us',
    bookCta: 'Book a Consultation',
    /** aria-label on the logo. {brand} is replaced with the wordmark. */
    brandHome: '{brand} home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    /** aria-labels on the language toggle, named for the language switched TO. */
    viewInHindi: 'View this page in Hindi',
    viewInEnglish: 'View this page in English',
  },

  footer: {
    /** Short column headings. Keys match the section `id`s in src/data/nav.ts. */
    cols: {
      symptoms: 'Symptoms',
      care: 'Care',
      community: 'Community',
      about: 'About',
    } as Record<string, string>,
    contact: 'Contact us',
    privacy: 'Privacy Policy',
    terms: 'Terms of Use',
    disclaimer: 'Medical Disclaimer',
    cookiePrefs: 'Cookie Preferences',
  },

  common: {
    whatsappLabel: 'WhatsApp',
    whatsappAria: 'Chat with us on WhatsApp',
    /** Pre-filled into the WhatsApp chat when the float button is tapped. */
    whatsappPrefill: "Hi, I'd like to know more about ResetWell Plus.",
  },
};
