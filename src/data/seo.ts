// Central SEO + brand configuration. Update brand/contact details here once.

export const BRAND = 'ResetWell Plus';
export const WORDMARK = 'ResetWell Plus'; // brand wordmark shown in the header/drawer

export const SITE = {
  name: BRAND,
  legalName: BRAND,
  url: 'https://www.resetwellplus.com',
  // Primary market is India; the brand also serves a broader audience.
  locale: 'en_IN',
  altLocales: ['en_US', 'en_GB'],
  defaultTitle: 'ResetWell Plus: Online Menopause & Perimenopause Care in India',
  titleTemplate: '%s | ResetWell Plus',
  defaultDescription:
    "ResetWell Plus is India's expert-led platform for perimenopause and menopause. Consult a menopause specialist online, check your symptoms, and get a personalised treatment plan.",
  ogImage: '/og-default.jpg',
  twitter: '@resetwellplus',
};

// Contact details.
export const CONTACT = {
  email: 'info@resetwellplus.com',
  phones: ['+1 (201) 282-8143', '+1 (732) 771-6575'],
  hours: ['Mon to Sat: 8am to 9pm IST', 'Sunday: 9am to 3pm IST'],
  social: {
    instagram: 'https://www.instagram.com/resetwellplus',
    instagramHandle: '@resetwellplus',
    facebook: 'https://www.facebook.com/resetwellplus',
    linkedin: 'https://www.linkedin.com/company/resetwellplus',
    linkedinHandle: '/resetwellplus',
    youtube: 'https://www.youtube.com/@resetwellplus',
    whatsapp: 'https://chat.whatsapp.com/CLWhb62O00qKW1bdOevWzT',
  },
};

// Site-wide structured data describing the clinic/organisation.
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalClinic',
  name: SITE.legalName,
  url: SITE.url,
  description: SITE.defaultDescription,
  // email intentionally omitted: the org JSON-LD is embedded on every page and
  // is a favourite harvesting spot for spam bots.
  medicalSpecialty: ['Gynecologic', 'Endocrine'],
  areaServed: { '@type': 'Country', name: 'India' },
  availableService: [
    { '@type': 'MedicalProcedure', name: 'Menopause consultation' },
    { '@type': 'MedicalProcedure', name: 'Perimenopause care' },
    { '@type': 'MedicalProcedure', name: 'Hormone replacement therapy (HRT) consultation' },
  ],
  knowsLanguage: ['en', 'hi'],
  // logo and image let search engines render a brand mark in knowledge panels;
  // priceRange is the field Google looks for on a clinic listing. Address and
  // telephone stay out on purpose: the practice is virtual-first and the
  // numbers are already obfuscated on the contact page to deter harvesting.
  logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png`, width: 224, height: 224 },
  image: `${SITE.url}${SITE.ogImage}`,
  priceRange: 'INR 1599 onwards',
  sameAs: [
    CONTACT.social.instagram,
    CONTACT.social.facebook,
    CONTACT.social.linkedin,
    CONTACT.social.youtube,
  ],
};

/**
 * India-specific keyword targets mapped to pages.
 * Used for reference/documentation and woven into each page's copy + meta.
 */
export const keywordTargets: Record<string, string[]> = {
  '/understand-your-symptoms/perimenopause-101': [
    'perimenopause symptoms in India',
    'menopause age in India',
    'early menopause India women',
    'perimenopause at 38 India',
    'is HRT safe in India',
  ],
  '/understand-your-symptoms/symptom-checker': [
    'perimenopause quiz India',
    'menopause symptom checker',
    'menopause joint pain India',
  ],
  '/get-care/how-it-works': [
    'online gynaecologist consultation India',
    'menopause treatment India',
    'online menopause doctor India',
  ],
  '/get-care/our-specialists': ['menopause expert India', 'menopause specialist India'],
  '/get-care/pricing': ['menopause consultation cost India', 'menopause treatment India'],
  '/community/join': ['menopause community India women', 'menopause support group India'],
  '/events/upcoming': ['hormonal health workshop India', 'menopause webinar India'],
  '/community/faqs': ['is HRT safe in India', 'menopause age in India'],
};

/**
 * WebSite node, emitted once on the homepage. Deliberately without
 * `potentialAction`/SearchAction: there is no site search to point it at, and
 * declaring a search endpoint that 404s is worse than having none.
 */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  alternateName: 'ResetWell',
  url: SITE.url,
  inLanguage: ['en-IN', 'hi-IN'],
  publisher: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
};
