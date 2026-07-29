// English copy: the source of truth for every user-facing string on the site.
//
// Keys are namespaced by area (seo.*, nav.*, footer.*, common.*). `hi.ts` mirrors
// this shape; anything missing there falls back to the English string here, so a
// half-translated key never renders as blank.
//
// House style carries into every language: no em-dashes.
import type {
  CareNeedCopy,
  EventCopy,
  FaqItem,
  FaqSectionCopy,
  FigureCopy,
  LegalNode,
  LinkCopy,
  PathwayCopy,
  QuizQuestion,
  QuizResult,
  SectionCopy,
  SpecialistItem,
  StatItem,
  StepItem,
  TestimonialItem,
} from './types';

/** Top-level navigation sections. Keys match the `id`s in src/data/nav.ts. */
const navSections: Record<string, SectionCopy> = {
  // Shortened from "Understand Your Symptoms" to buy horizontal room in the
  // header, which now carries the longer "Workplace Wellness" item.
  symptoms: { label: 'Symptoms' },
  care: { label: 'Get Care' },
  events: { label: 'Events' },
  workplaceWellness: { label: 'Workplace Wellness' },
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
  communityJoin: { label: 'Join the Community', short: 'Join' },
  // Still used by the page itself and by the Testimonials link, even though
  // Stories of Reset has no menu entry.
  storiesOfReset: { label: 'Stories of Reset' },
  faqs: { label: 'FAQs' },
  founders: { label: 'Meet the Founders' },
  ourStory: { label: 'Our Story' },
  ourTeam: { label: 'Our Team' },
  inThePress: { label: 'In The Press' },
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
    comingSoon: 'Coming soon',
    prev: 'Previous',
    next: 'Next',
    genericError: 'Something went wrong. Please try again.',
  },

  // -------------------------------------------------------------------------
  // Components
  // -------------------------------------------------------------------------

  hero: {
    eyebrow: 'Perimenopause · Menopause · Midlife hormonal health',
    title: 'Online Menopause and Perimenopause Care for Women in India',
    subtitle: "Your body isn't failing you. It's asking for care you haven't been given yet.",
    body: "ResetWell Plus is India's expert-led women's midlife health platform for perimenopause, menopause, and every hormonal transition in between, with virtual consultations, events, and a community of women who truly get it.",
    quizCta: 'Take the Free Symptom Quiz',
    bookCta: 'Book a Consultation',
    imageAlt: 'A woman smiling and gazing toward bright window light, hair flowing, in a calm modern interior',
    /** Rating badge, currently hidden in the markup */
    ratingCaption: 'from 12,000+ women',
  },

  problemStrip: {
    heading: '1 in 3 Indian women navigate perimenopause without a diagnosis. That ends here.',
    figures: [
      {
        stat: '46.2 years',
        body: 'The average age Indian women reach menopause. Up to five years earlier than the global average.',
      },
      {
        stat: '4.73 years',
        body: 'The average time educated Indian women wait before seeking help for symptoms they are already experiencing.',
      },
      {
        stat: '80%',
        body: 'The proportion of Indian menopausal women experiencing joint pain and musculoskeletal symptoms.',
      },
    ] as FigureCopy[],
    closer: 'Your aches are not imagined. They are hormonal.',
  },

  threePathways: {
    eyebrow: 'How we help',
    heading: 'Multiple pathways to feeling like yourself.',
    /** Keys match the pathway ids in the component. */
    items: {
      events: {
        title: 'Expert-Led Events',
        body: 'Live and virtual sessions led by gynaecologists, endocrinologists, menopause coaches, health and fitness specialists and psychologists.',
        cta: 'Reserve a Seat',
      },
      care: {
        title: 'Virtual Care',
        body: 'One-on-one virtual consultation with a trained specialist. Care plan within 24 hours. All of India.',
        cta: 'Book a Consultation',
      },
      community: {
        title: 'Community',
        body: 'A private, expert-facilitated community of Indian women navigating the same transitions as you.',
        cta: 'Join Free',
      },
    } as Record<string, PathwayCopy>,
    alt: {
      events: 'Expert events',
      care: 'Virtual care consultation',
      community: 'Community of women',
    } as Record<string, string>,
  },

  valueStrip: {
    eyebrow: 'Relief within reach',
    heading: 'Transparent care, one simple price.',
    body: "No insurance maze, no hidden fees. Pay directly for expert care, and know exactly what's included before you book.",
    cta: 'See Pricing',
  },

  careGrid: {
    eyebrow: 'Support at 30, 40, 50+',
    heading: 'Never too early. Never too late.',
    body: "Wherever you are in your journey, we'll meet you there with the solutions you need.",
  },

  expertise: {
    eyebrow: 'Expertise + empathy',
    heading: 'We see you. We hear you. We can help.',
    body: "Our clinicians specialise in women's midlife health, so you'll feel heard from your very first visit. We help you understand the root cause of your symptoms, then offer real solutions so relief comes sooner.",
    cta: 'Meet Our Specialists',
    imageAlt: 'A ResetWell Plus clinician listening attentively to a woman during a consultation',
  },

  howItWorks: {
    eyebrow: 'Easy as 1, 2, 3',
    heading: 'Ready for relief?',
    cta: 'Book a Consultation',
  },

  testimonials: {
    eyebrow: "Don't just take our word for it",
    heading: 'True stories of transformation',
    more: 'See more patient stories →',
  },

  dailyQuote: {
    eyebrow: 'Today’s Reset',
    strapline: 'A new thought for women in midlife, every day.',
    share: 'Share on WhatsApp',
    /** WhatsApp share text. {quote} is the quote of the day, {url} the site. */
    shareText:
      "Today's Reset from ResetWell Plus:\n\n\"{quote}\"\n\nA new thought for women in midlife, every day: {url}",
  },

  finalCta: {
    eyebrow: 'The ResetWell Plus mission',
    heading: 'The midlife care you deserve, starting today.',
    bookCta: 'Book a Consultation',
    partnerCta: 'Partner With Us',
  },

  faq: {
    heading: 'Questions, answered',
  },

  specialistsGrid: {
    portrait: 'Portrait',
  },

  eventsList: {
    emptyKicker: 'Coming soon',
    emptyHeading: 'New events are on the way',
    emptyBody:
      "We're lining up our next live sessions. Join the community to hear about dates first, or browse our on-demand library in the meantime.",
    emptyNotify: 'Get notified',
    emptyWatch: 'Watch on demand',
  },

  eventsCommunity: {
    eventsEyebrow: 'Events',
    eventsHeading: 'Learn from the experts',
    communityEyebrow: 'Community',
    communityHeading: "Join the women's health revolution",
    communityBody:
      'A private, moderated, judgement-free space to share what works, and feel a little less alone.',
    emailPlaceholder: 'you@example.com',
    joinCta: 'Join free',
    joined: 'Welcome in ✓ Check your inbox to confirm.',
  },

  onDemandVideos: {
    watch: 'Watch on YouTube',
  },

  symptomChecker: {
    /** {n} of {total} */
    progress: 'Question {n} of {total}',
    restart: 'Start over',
    questions: [
      {
        q: 'Your age',
        options: [
          { label: 'Under 35', points: 0 },
          { label: '35-39', points: 1 },
          { label: '40-44', points: 2 },
          { label: '45-49', points: 3 },
          { label: '50-54', points: 3 },
          { label: '55 or older', points: 2 },
        ],
      },
      {
        q: 'Periods in the last 6 months',
        options: [
          { label: 'Regular as always', points: 0 },
          { label: 'Slightly irregular', points: 1 },
          { label: 'Very irregular or skipping months', points: 3 },
          { label: 'No periods for 12+ months', points: 3 },
        ],
      },
      {
        q: 'Joint pain or body aches, especially in the morning',
        options: [
          { label: 'None', points: 0 },
          { label: 'Mild, occasional', points: 1 },
          { label: 'Often', points: 2 },
          { label: 'Significant, affecting daily activities', points: 3 },
        ],
      },
      {
        q: 'Sleep, compared to 3 years ago',
        options: [
          { label: 'Still good', points: 0 },
          { label: 'Slightly worse', points: 1 },
          { label: 'Often disrupted or waking early', points: 2 },
          { label: 'Much worse, significantly affecting energy and mood', points: 3 },
        ],
      },
      {
        q: 'Mood, anxiety, or emotional changes',
        options: [
          { label: 'No change', points: 0 },
          { label: 'Mild', points: 1 },
          { label: 'Noticeable, people around me have mentioned it', points: 2 },
          { label: 'Significant, affecting work or relationships', points: 3 },
        ],
      },
      {
        q: 'Weight, especially around the abdomen, without diet changes',
        options: [
          { label: 'No change', points: 0 },
          { label: 'Slight', points: 1 },
          { label: 'Yes, noticeable', points: 2 },
        ],
      },
      {
        q: 'Brain fog, forgetting words, difficulty concentrating',
        options: [
          { label: 'Rarely', points: 0 },
          { label: 'Sometimes', points: 1 },
          { label: 'Often', points: 2 },
          { label: 'Affecting my work or daily function', points: 3 },
        ],
      },
      {
        q: 'Hot flashes, night sweats, or sudden waves of heat',
        options: [
          { label: 'Never', points: 0 },
          { label: 'Occasionally', points: 1 },
          { label: 'Often', points: 2 },
          { label: 'Daily or more', points: 3 },
        ],
      },
      {
        q: 'Fatigue that is different from normal tiredness',
        options: [
          { label: 'Not really', points: 0 },
          { label: 'Mild', points: 1 },
          { label: 'Often', points: 2 },
          { label: 'Significant and heavy', points: 3 },
        ],
      },
      {
        q: "'Your tests are normal', but you still feel something is wrong?",
        options: [
          { label: 'No', points: 0 },
          { label: 'Yes, once', points: 1 },
          { label: 'Yes, multiple times', points: 2 },
        ],
      },
    ] as QuizQuestion[],
    results: {
      high: {
        kicker: 'High alignment',
        title: 'Your symptom pattern is consistent with perimenopause.',
        body: "What you're experiencing lines up closely with perimenopause. A specialist can confirm and build a plan for you.",
        cta: 'Book a Consultation',
      },
      moderate: {
        kicker: 'Moderate alignment',
        title: 'Your symptoms overlap with perimenopause, but may also have other components.',
        body: 'Some of your symptoms align with perimenopause, though other factors could be involved. A conversation, or some reading, is a good next step.',
        cta: 'Book a Consultation',
      },
      lower: {
        kicker: 'Lower alignment',
        title: "Your responses don't strongly indicate perimenopause at this stage.",
        body: 'Hormonal health is dynamic, so this can change over time. Learning the signs now means you will recognise them early.',
        cta: 'Start with our Perimenopause 101 guide',
      },
    } as Record<string, QuizResult>,
  },

  bookingForm: {
    visitType: 'Visit type',
    virtual: 'Virtual',
    inClinic: 'In clinic',
    name: 'Full name',
    email: 'Email',
    date: 'Preferred date',
    submit: 'Confirm Booking',
    note: 'No referral needed · Reschedule anytime',
    successHeading: "You're booked ✓",
    successBody: 'Check your inbox for confirmation and a short intake form.',
  },

  joinForm: {
    email: 'Email address',
    submit: 'Join the Community',
    submitting: 'Joining…',
    note: 'Free · Private · Unsubscribe anytime',
    success: 'Welcome in ✓',
  },

  announcement: {
    text: 'Specialist-led care · Same-week appointments · Transparent pricing ·',
    cta: 'Book a visit →',
  },

  legal: {
    /** Shown on the Hindi legal pages only (see LegalLangNote.astro). */
    translationNote:
      'This page is a Hindi translation provided for convenience. If anything in it differs from the English version, the English version applies.',
    readEnglish: 'Read the English version',
  },

  consent: {
    dialogLabel: 'Cookie consent',
    body: 'We use cookies for analytics and to measure our outreach (Google Tag Manager, Meta Pixel). They stay off unless you accept. Read more in our',
    privacyLink: 'Privacy Policy',
    accept: 'Accept',
    decline: 'Decline',
  },

  // -------------------------------------------------------------------------
  // Shared datasets (structure lives in src/data/content.ts)
  // -------------------------------------------------------------------------

  content: {
    stats: [
      { value: '30 min', label: 'unhurried specialist visit' },
      { value: '₹1,599', label: 'flat consultation fee' },
    ] as StatItem[],

    careNeeds: {
      perimenopause: { title: 'Perimenopause', blurb: 'The early years of change, explained.' },
      menopause: { title: 'Menopause', blurb: 'Care for the transition and beyond.' },
      sleep: { title: 'Sleep', blurb: 'Rest that actually restores you.' },
      moodMemory: { title: 'Mood & Memory', blurb: 'Steadier mood, sharper focus.' },
      weight: { title: 'Weight', blurb: 'Midlife metabolism, understood.' },
      hairSkin: { title: 'Hair & Skin', blurb: 'Hormonal changes, addressed.' },
      sexualWellness: { title: 'Sexual Wellness', blurb: 'Intimacy and comfort, restored.' },
      boneHeart: { title: 'Bone & Heart', blurb: 'Protect your long-term health.' },
    } as Record<string, CareNeedCopy>,

    steps: [
      { n: '1', title: 'Book your visit', body: 'Pick a time that suits you and pay a flat, transparent fee.' },
      {
        n: '2',
        title: 'Meet your specialist',
        body: 'Join a virtual visit to discuss your health history, symptoms and goals, and get your questions answered.',
      },
      {
        n: '3',
        title: 'Start your care plan',
        body: 'Your clinician designs a personalised, holistic plan and supports your progress at every step.',
      },
    ] as StepItem[],

    // Names stay in Latin script in every language; only the roles translate.
    specialists: [
      { name: 'Dr. Ananya Rao', role: 'Menopause Specialist' },
      { name: 'Dr. Sara Mathew', role: 'Endocrinologist' },
      { name: 'Priya Nair', role: 'Menopause Nutritionist' },
      { name: 'Dr. Leela Menon', role: "Women's Health Lead" },
    ] as SpecialistItem[],

    testimonials: [
      {
        quote: 'For the first time, a clinician actually listened. By the end of the day my prescription was sorted.',
        name: 'Meera, 49',
      },
      { quote: 'Within two weeks my hot flushes were gone. I feel like I can breathe again.', name: 'Anjali, 47', feature: true },
      { quote: 'Clear, flat pricing and my clinician was kind and thorough. I felt heard.', name: 'Fatima, 52' },
      { quote: 'I spent years being dismissed. Finally, a team that knows how to help.', name: 'Libby, 51', feature: true },
      {
        quote: "My joint pain subsided, I'm sleeping better, my moods levelled out. Best I've felt in a year.",
        name: 'Diana, 53',
      },
      { quote: 'The care was more than I could have hoped for. I finally feel like myself.', name: 'Sabrina, 46' },
    ] as TestimonialItem[],

    /** Short pre-booking FAQ shown on the homepage and inner pages. */
    faqs: [
      { q: 'Do I need a referral to book?', a: "No referral needed. Book directly and we'll handle everything from there." },
      {
        q: 'How does payment work?',
        a: 'We charge patients directly, a flat transparent fee per consultation, with no insurance paperwork or hidden costs. See the Pricing page for details.',
      },
      { q: 'Online or in person?', a: 'All consultations are online, so you can get expert care from wherever you are.' },
      { q: 'What does it cost?', a: 'Consultations start at ₹1,599. See the Pricing page for full details.' },
    ] as FaqItem[],

    events: {
      hrtMyths: { title: 'HRT: Myths vs Facts', meta: 'On demand · 48 min', tag: 'On Demand' },
      strengthBones: { title: 'Strength & Bones', meta: 'On demand · 35 min', tag: 'On Demand' },
    } as Record<string, EventCopy>,
  },

  // -------------------------------------------------------------------------
  // Page copy
  //
  // Each key holds one page's own strings, including its SEO meta. The
  // breadcrumb `section` is not repeated here: pages pass the matching
  // `nav.sections.*.label` so a section is named the same everywhere.
  // -------------------------------------------------------------------------

  pages: {
    howItWorks: {
      kicker: 'Get Care',
      title: 'Your first appointment should feel like a relief, not an ordeal.',
      metaTitle: 'How Online Menopause Consultations Work in India | ResetWell Plus',
      description:
        'How an online gynaecologist consultation in India works at ResetWell Plus: symptom intake, specialist match, a 30-minute virtual appointment, and a written care plan you keep.',
      keywords:
        'online gynaecologist consultation India, menopause treatment India, online menopause doctor India, virtual menopause consultation',
      lede: 'For many Indian women, a medical appointment about menopause brings two feelings: nervousness about being dismissed again, and uncertainty about what to say. This page removes both. Here is exactly what happens from the moment you click Book to the moment you have a care plan.',
      steps: [
        {
          n: 'Step 1',
          title: 'The Symptom Intake, a few minutes',
          body: "Before your appointment, you'll complete a brief digital questionnaire. It covers your current symptoms, cycle history, any relevant medical background, and what you most want to address. This means your specialist arrives already understanding your situation, not asking basic questions and running out of time.",
        },
        {
          n: 'Step 2',
          title: 'Your Specialist Match',
          body: "Based on your intake, we match you with a specialist whose expertise aligns with your stage and symptoms. You'll see their photo, full credentials (MBBS, DGO, IMS membership, etc.), and a short personal bio before you confirm. If you'd prefer a different specialist, you can always choose again.",
        },
        {
          n: 'Step 3',
          title: 'Your Virtual Appointment, 30 minutes',
          body: 'Your consultation happens over secure video. You can join from your phone, tablet, or laptop, from home, from work, or anywhere private. The specialist reviews your intake, asks follow-up questions, explains their interpretation of your symptoms, and discusses your options with you. This is a conversation, not a prescription relay.',
        },
        {
          n: 'Step 4',
          title: 'Your Written Care Plan',
          body: "After your appointment, you'll receive a written care plan. This typically includes a summary of what your specialist identified, recommended treatment or management options, any relevant lifestyle guidance, and a scheduled follow-up if needed. You keep this document forever.",
        },
      ] as StepItem[],
      preQsHeading: 'Questions Indian women ask before their first appointment',
      preQs: [
        { q: 'Will my family know?', a: 'No. Your consultation is completely confidential.' },
        {
          q: 'Can you prescribe HRT and other medicines?',
          a: 'Yes. Our specialists are licensed to prescribe India-approved formulations.',
        },
        { q: "What if I'm in a smaller city?", a: 'We serve all of India. Evening and weekend slots are available.' },
        {
          q: 'What does it cost?',
          a: 'First consultation from ₹1,599. Follow-ups are included in the Care Plan. No hidden charges.',
        },
        {
          q: 'Can I continue with my current gynaecologist?',
          a: 'Yes. We work alongside your existing care, not instead of it.',
        },
        {
          q: 'What if I want to use Ayurvedic remedies too?',
          a: 'We discuss all options, Ayurvedic and clinical, to find what works for you.',
        },
      ] as FaqItem[],
      cta: 'Book a Consultation',
    },

    ourSpecialists: {
      kicker: 'Get Care',
      title: 'Meet Our Specialists',
      metaTitle: 'Menopause Specialists & Experts in India | ResetWell Plus',
      description:
        "ResetWell Plus is building a panel of menopause specialists in India: gynaecologists, endocrinologists and nutritionists who specialise in women's midlife health. Introductions coming soon.",
      keywords: 'menopause expert India, menopause specialist India, gynaecologist menopause India',
      lede: "Clinicians who specialise in women's midlife health, so you feel heard from your first visit.",
      heading: 'Our specialist panel is on its way.',
      body: "We're partnering with leading menopause clinicians across India. Stay tuned, we'll introduce the team here soon. In the meantime, join our community to be the first to know.",
      joinCta: 'Join the community',
      contactCta: 'Contact us',
    },

    pricing: {
      title: 'Simple, Transparent Pricing',
      metaTitle: 'Menopause Consultation Cost in India | ResetWell Plus Pricing',
      description:
        'Transparent menopause consultation pricing in India. Pay patients directly with no insurance paperwork. Single visits from ₹1,599 and ongoing care plans.',
      keywords: 'menopause consultation cost India, menopause treatment India, menopause consultation price',
      lede: 'We charge patients directly, with no insurance paperwork and no hidden fees. All prices in ₹.',
      /** Keys match the tier ids in the page. */
      tiers: {
        single: {
          name: 'Single visit',
          price: '₹1,599',
          sub: 'per consultation',
          desc: 'Everything you need for a focused, unhurried first consultation with a menopause specialist.',
          items: [
            '30-minute specialist consultation',
            'Personalised written care plan',
            'Prescription if clinically needed',
            'Secure online video visit',
            'A care summary you keep forever',
            'Message your clinician after your visit',
          ],
          note: 'No hidden charges. No referral needed.',
          cta: 'Book now',
        },
      } as Record<string, { name: string; price: string; sub: string; desc: string; items: string[]; note: string; cta: string }>,
    },

    perimenopause101: {
      kicker: 'Understand Your Symptoms',
      title: 'Perimenopause 101',
      metaTitle: 'Perimenopause Symptoms in India: Perimenopause 101 | ResetWell Plus',
      description:
        'Perimenopause symptoms in India explained: the signs, the average menopause age in India, early menopause, perimenopause at 38, and whether HRT is safe. Reviewed by menopause specialists.',
      keywords:
        'perimenopause symptoms in India, menopause age in India, early menopause India women, perimenopause at 38 India, is HRT safe in India',
      lede: 'The years before your last period can bring forty-plus symptoms. Here is what is happening for women in India, and what helps.',
      schemaName: 'Perimenopause 101',
      schemaDescription:
        'Perimenopause symptoms in India explained: the signs, the average menopause age in India, early menopause, and what helps.',
      sections: [
        {
          h: 'What is perimenopause?',
          p: 'The transition leading up to menopause, when hormone levels begin to fluctuate. In India it can start in the late 30s or 40s and last several years, sometimes earlier than many women expect.',
        },
        {
          h: 'Common symptoms',
          p: 'Irregular periods, hot flushes, disrupted sleep, mood changes, brain fog, joint aches, and shifts in energy and weight. Over forty symptoms in total.',
        },
        {
          h: 'Why it happens',
          p: 'Oestrogen and progesterone rise and fall unpredictably, affecting far more than your cycle, from your brain to your bones.',
        },
        {
          h: 'What can help',
          p: 'From lifestyle and nutrition to hormone therapy where appropriate, a specialist can build a plan tailored to you. HRT is safe for many women when guided by an expert.',
        },
      ] as { h: string; p: string }[],
      cta: 'Take the Free Symptom Quiz',
    },

    contact: {
      kicker: 'Contact',
      title: 'Contact Us',
      metaTitle: 'Contact ResetWell Plus | Menopause Care in India',
      description:
        'Get in touch with ResetWell Plus. Questions about perimenopause and menopause care, consultations, events or partnerships, our team is here to help.',
      keywords: 'contact ResetWell Plus, menopause care India contact',
      lede: 'Questions about your symptoms, consultations, events or partnerships? Send us a message and our care team will get back to you.',
      formHeading: 'Send us a message',
      nameLabel: 'Name',
      namePlaceholder: 'Your full name',
      emailLabel: 'Email',
      /** A literal format example: stays in English in every language. */
      emailPlaceholder: 'your@email.com',
      phoneLabel: 'Phone',
      phonePlaceholder: '10-digit mobile number',
      messageLabel: 'Message',
      messagePlaceholder: "Tell us about yourself and what you're looking for...",
      securityCheck: 'Security Check',
      /** {q} is the generated sum, e.g. "6 + 8". */
      captchaQuestion: 'What is {q}?',
      captchaPlaceholder: 'Your answer',
      captchaError: "That answer isn't right, please try again.",
      submit: 'Send Message',
      sending: 'Sending\u2026',
      successHeading: 'Message sent \u2713',
      successBody: 'Thank you for reaching out. Our care team will get back to you within one working day.',
      reachUs: 'Reach us directly',
      showDetails: 'Show contact details',
      connect: 'Connect',
      emailShort: 'Email',
      phoneShort: 'Phone',
    },

    smsConsent: {
      kicker: 'SMS Messaging',
      title: 'SMS Communication Opt-In',
      metaTitle: 'SMS Consent | ResetWell Plus',
      description:
        'Opt in to receive promotional and informational SMS text messages from ResetWell Plus. Message and data rates may apply. Reply STOP to opt out.',
      lede: 'ResetWell Plus: Proof of Consent (Opt-In) for SMS Messaging.',
      termsHeading: 'Terms of Service',
      termsBody:
        'By providing your phone number below, you can choose to receive promotional (marketing) and/or informational SMS text messages from ResetWell Plus or ResetWell Plus LLC. Each type of message can be opted in to separately.',
      typesHeading: 'Message Types',
      promotionalHeading: 'Promotional (Marketing)',
      promotionalItems: ['Exclusive offers and promotional deals', 'Wellness retreat announcements'],
      informationalHeading: 'Informational',
      informationalItems: [
        'Event updates and reminders',
        'Booking confirmations and changes',
        'Transactional messages related to your reservations',
      ],
      frequencyHeading: 'Message Frequency',
      frequencyBody: 'Message frequency varies. Standard message and data rates may apply.',
      cancellationHeading: 'Cancellation',
      cancellationBody:
        'To stop receiving messages, text STOP to the number sending the message. Reply HELP for more information.',
      proofLabel: 'Proof of Consent:',
      proofBody:
        'By submitting this form, you are providing documented proof of opt-in consent to receive SMS messages from ResetWell Plus or ResetWell Plus LLC.',
      phoneLabel: 'Phone Number',
      consentMarketing:
        'I agree to receive promotional SMS text messages from ResetWell Plus or ResetWell Plus LLC, including offers and exclusive deals. I understand that message and data rates may apply and I can opt out by texting STOP at any time.',
      consentInformational:
        'I agree to receive informational SMS text messages from ResetWell Plus or ResetWell Plus LLC, including event updates, booking confirmations, and transactional information. I understand that message and data rates may apply and I can opt out by texting STOP at any time.',
      submit: 'I Agree and Opt In',
      submitting: 'Submitting\u2026',
      formNote: 'This opt-in is recorded as proof of consent for SMS communication verification purposes.',
      successHeading: 'Consent recorded \u2713',
      successBody: 'Your SMS consent has been recorded. Thank you for opting in!',
      /** {link} becomes a link reading `contactPage`. */
      questions: 'Questions? Reach us through the {link}.',
      contactPage: 'contact page',
    },

    privacyPolicy: {
      kicker: 'Legal',
      title: 'Privacy Policy',
      metaTitle: 'Privacy Policy | ResetWell Plus',
      description: 'Learn how ResetWell Plus protects your privacy and handles your personal information.',
      lede: 'How ResetWell Plus collects, uses and protects your personal and health information.',
      lastUpdated: 'Last updated: 1 July 2026',
      /** {sms} and {contact} become links to those pages. */
      body: [
        { h: '1. Introduction' },
        { p: 'ResetWell Plus (\u201cwe,\u201d \u201cus,\u201d or \u201cour\u201d) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose and safeguard your information when you visit resetwellplus.com and use our services.' },
        { h: '2. Information We Collect' },
        { p: 'We may collect information about you in a variety of ways. The information we may collect on the site includes:' },
        { ul: [
          '<strong>Personal Data:</strong> Name, email address, phone number, and other identifiers.',
          '<strong>Payment Information:</strong> Credit card and billing details (processed securely through third parties).',
          '<strong>SMS Consent Data:</strong> Phone number and consent timestamp for SMS communications.',
          '<strong>Technical Data:</strong> IP address and browser user agent, recorded when you submit a form on the site. We use this for security, spam prevention, and as part of your documented SMS consent record.',
          '<strong>Usage Data:</strong> Information about how you interact with our website.',
        ] },
        { h: '3. How We Use Your Information' },
        { p: 'We use the information we collect to:' },
        { ul: [
          'Process event bookings and payment transactions',
          'Send SMS messages (only with your explicit opt-in consent)',
          'Provide customer support and respond to inquiries',
          'Send promotional emails and updates (with opt-out options)',
          'Improve our website and services',
          'Comply with legal and regulatory requirements',
        ] },
        { h: '4. SMS Communication' },
        { p: 'When you opt in to SMS communications, your phone number and consent information are stored securely. We use this data solely for the purposes of sending promotional and transactional SMS messages as described in our SMS Consent terms. We do not share your information with third parties.' },
        { p: 'To manage your SMS preferences, visit our {sms} page.' },
        { h: '5. Data Security' },
        { p: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure.' },
        { h: '6. Third-Party Services' },
        { p: 'We may share your information with third-party service providers who assist us in operating our website and conducting our business, including payment processors, email service providers, and analytics providers. These service providers are contractually obligated to use your information only as necessary to provide services to us.' },
        { h: '7. Your Rights' },
        { p: 'You have the right to:' },
        { ul: [
          'Access the personal information we hold about you',
          'Request correction of inaccurate data',
          'Request deletion of your data (subject to legal obligations)',
          'Opt out of SMS communications by texting STOP',
          'Opt out of promotional emails using the unsubscribe link',
        ] },
        { h: '8. Cookies and Tracking' },
        { p: 'With your consent, we use analytics and advertising tools, currently Google Tag Manager (including Google Analytics) and the Meta Pixel, to understand how visitors use our site and to measure our outreach. These tools set cookies and collect usage information such as pages visited, approximate location, and device details. They remain switched off until you choose Accept on our cookie banner. You can withdraw or change your choice at any time using the Cookie Preferences link in the footer, or control cookies through your browser settings.' },
        { h: "9. Children's Privacy" },
        { p: 'Our services are not directed to children under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will delete such information promptly.' },
        { h: '10. Changes to This Privacy Policy' },
        { p: 'We may update this Privacy Policy from time to time. The updated version will be indicated by a revised \u201cLast updated\u201d date and will be effective as soon as it is accessible.' },
        { h: '11. Contact Us' },
        { p: 'If you have questions about this Privacy Policy or our privacy practices, please reach out to us through the {contact} page.' },
      ] as LegalNode[],
      smsLinkText: 'SMS Consent',
      contactLinkText: 'Contact Us',
    },

    terms: {
      kicker: 'Legal',
      title: 'Terms of Use',
      metaTitle: 'Terms of Use | ResetWell Plus',
      description:
        'Read the Terms of Use for ResetWell Plus LLC. By using our website and services, you agree to these terms governed by Indian law.',
      lede: 'The terms that govern your use of the ResetWell Plus platform and services.',
      lastUpdated: 'Last updated: 1 July 2026',
      /** {privacy}, {sms} and {contact} become links to those pages. */
      body: [
        { h: '1. Acceptance of Terms' },
        { p: 'Welcome to ResetWell Plus. These Terms of Use (“Terms”) govern your access to and use of resetwellplus.com (the “Platform”) and all related services, and all applicable laws and regulations.' },
        { p: 'These Terms constitute a binding legal agreement between you and ResetWell Plus LLC and ResetWell Plus Pvt. Ltd. in accordance with the <strong>Indian Contract Act, 1872</strong> and the <strong>Information Technology Act, 2000</strong> and rules thereunder. If you do not agree to these Terms, please do not use our Platform.' },
        { p: 'By continuing to access or use this Platform, you represent that you are at least 18 years of age and have the legal capacity to enter into a binding contract under Indian law.' },
        { h: '2. Description of Services' },
        { p: 'ResetWell Plus provides a wellness platform offering:' },
        { ul: [
          'Online and in-person wellness events, retreats, and webinars',
          'Women\'s health educational content, videos, and resources',
          'Event registration and booking services',
          'Community engagement through surveys and interactive content',
          'Informational blog articles and wellness guidance',
        ] },
        { p: 'Our services are intended for informational and educational purposes only and do not constitute medical advice. Always consult a qualified healthcare professional before making any health-related decisions.' },
        { h: '3. User Eligibility and Registration' },
        { p: 'To access certain features of the Platform, you may be required to register or provide personal information. You agree to:' },
        { ul: [
          'Provide accurate, current, and complete information during registration',
          'Maintain and promptly update your information',
          'Be responsible for all activities that occur under your account',
          'Notify us immediately of any unauthorized use of your account',
        ] },
        { p: 'We reserve the right to refuse access, suspend, or terminate accounts at our sole discretion, including for violations of these Terms.' },
        { h: '4. Booking, Payments, and Cancellations' },
        { p: 'All bookings made through the Platform are subject to the following:' },
        { ul: [
          '<strong>Payment:</strong> All fees are quoted in applicable currency and are inclusive of applicable taxes unless stated otherwise. Payments are processed securely through third-party payment gateways.',
          '<strong>Confirmation:</strong> A booking is confirmed only upon receipt of full payment and a confirmation email from us.',
          '<strong>Cancellations by User:</strong> Cancellation requests must be submitted via email to us. Refund eligibility depends on the timing of the cancellation and the specific event\'s refund policy communicated at the time of booking.',
          '<strong>Cancellations by ResetWell Plus:</strong> We reserve the right to cancel or reschedule events. In such cases, registered participants will receive a full refund or the option to transfer to a rescheduled event.',
          '<strong>Non-transferability:</strong> Bookings are personal and may not be transferred to another individual without prior written consent from us.',
        ] },
        { p: 'These terms are consistent with the <strong>Consumer Protection Act, 2019</strong> and applicable consumer rights in India regarding unfair trade practices.' },
        { h: '5. Intellectual Property Rights' },
        { p: 'All content on this Platform, including but not limited to text, graphics, logos, images, audio clips, video content, and software, is the exclusive property of ResetWell Plus or its licensors and is protected under:' },
        { ul: [
          'Copyright Act, 1957',
          'Trade Marks Act, 1999',
          'Other applicable intellectual property laws',
        ] },
        { p: 'You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content from this Platform without our prior written permission. Unauthorized use constitutes infringement and may attract civil and criminal liability.' },
        { h: '6. User Conduct and Prohibited Activities' },
        { p: 'You agree not to use the Platform to:' },
        { ul: [
          'Publish, transmit, or distribute any unlawful, harmful, defamatory, obscene, or otherwise objectionable content',
          'Impersonate any person or entity or misrepresent your affiliation with any person or entity',
          'Attempt to gain unauthorized access to any part of the Platform or its related systems',
          'Introduce viruses, malware, or any other harmful software',
          'Engage in any activity that disrupts or interferes with the Platform\'s functionality',
          'Collect or harvest any personally identifiable information from other users',
          'Use automated tools, bots, or scrapers to access the Platform',
          'Engage in any conduct that violates applicable Indian laws, including the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>',
        ] },
        { p: 'Violation of any of the above may result in immediate termination of your access and may be reported to appropriate law enforcement authorities.' },
        { h: '7. Privacy and Data Protection' },
        { p: 'Your use of the Platform is also governed by our {privacy}, which is incorporated into these Terms by reference. We handle your personal data in accordance with the <strong>Information Technology Act, 2000</strong>, the <strong>Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong>, and the <strong>Digital Personal Data Protection Act, 2023</strong>.' },
        { p: 'We implement appropriate technical and organizational measures to safeguard your personal data. By using our Platform, you consent to the collection, storage, processing, and transfer of your data as described in our Privacy Policy.' },
        { h: '8. SMS and Electronic Communications' },
        { p: 'By providing your mobile phone number and opting in to SMS communications through our {sms} page, you consent to receive transactional and promotional SMS messages from ResetWell Plus. You may opt out at any time by texting <strong>STOP</strong>.' },
        { p: 'All electronic communications, records, and contracts formed through this Platform shall be deemed valid and enforceable under the <strong>Information Technology Act, 2000</strong>, which recognizes electronic records and electronic signatures as legally valid.' },
        { h: '9. Third-Party Links and Services' },
        { p: 'Our Platform may contain links to third-party websites, payment gateways, or services. These links are provided for your convenience only. We have no control over the content or practices of third-party sites and accept no responsibility for them. Accessing third-party links is at your own risk.' },
        { p: 'Our payment processing is handled by third-party payment providers. By completing a transaction, you also agree to their terms of service and privacy policies.' },
        { h: '10. Medical and Health Disclaimer' },
        { p: 'All content provided on this Platform, including wellness information, blog articles, video content, and event materials, is for <strong>general informational and educational purposes only</strong>. It is not intended to be, and should not be construed as, medical advice, diagnosis, or treatment.' },
        { p: 'You should always seek the advice of a qualified medical professional or healthcare provider with any questions you may have regarding a medical condition. ResetWell Plus expressly disclaims any liability for decisions made based on information obtained from this Platform.' },
        { h: '11. Disclaimer of Warranties' },
        { p: 'The Platform and all services are provided on an “as is” and “as available” basis without any warranties of any kind, either express or implied, including but not limited to:' },
        { ul: [
          'Warranties of merchantability, fitness for a particular purpose, or non-infringement',
          'That the Platform will be uninterrupted, error-free, or free of viruses or other harmful components',
          'That the content is accurate, complete, or up to date',
        ] },
        { p: 'To the fullest extent permitted by applicable Indian law, ResetWell Plus disclaims all warranties and representations.' },
        { h: '12. Limitation of Liability' },
        { p: 'To the maximum extent permitted by law, ResetWell Plus, its officers, directors, employees, agents, and partners shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or relating to your use of the Platform, including but not limited to:' },
        { ul: [
          'Loss of data, revenue, or profits',
          'Business interruption',
          'Personal injury or property damage',
          'Unauthorized access to or alteration of your transmissions or data',
        ] },
        { p: 'Our total cumulative liability to you for any claims arising under these Terms shall not exceed the amount you paid us in the three months preceding the claim.' },
        { h: '13. Indemnification' },
        { p: 'You agree to indemnify, defend, and hold harmless ResetWell Plus and its officers, directors, employees, agents, and licensors from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising out of or in connection with:' },
        { ul: [
          'Your use of or inability to use the Platform',
          'Your violation of these Terms',
          'Your violation of any third-party rights, including intellectual property or privacy rights',
          'Any content you submit, post, or transmit through the Platform',
        ] },
        { h: '14. Governing Law and Jurisdiction' },
        { p: 'These Terms shall be governed by and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law provisions. The courts of competent jurisdiction in India shall have exclusive jurisdiction over any disputes arising out of or in connection with these Terms or your use of the Platform.' },
        { p: 'Applicable statutes include but are not limited to:' },
        { ul: [
          'Information Technology Act, 2000 and its amendments',
          'Consumer Protection Act, 2019',
          'Indian Contract Act, 1872',
          'Digital Personal Data Protection Act, 2023',
        ] },
        { h: '15. Dispute Resolution' },
        { p: 'In the event of any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, or validity thereof, the parties shall first attempt to resolve the dispute amicably through good-faith negotiations.' },
        { p: 'If the dispute cannot be resolved within 30 days of written notice, either party may refer it to arbitration in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong> (India). The arbitration shall be conducted in English, and the seat of arbitration shall be in India.' },
        { p: 'Nothing in this clause shall prevent either party from seeking urgent injunctive or equitable relief from a court of competent jurisdiction.' },
        { h: '16. Modifications to Terms' },
        { p: 'We reserve the right to modify these Terms at any time. Any changes will be posted on this page with an updated effective date. Your continued use of the Platform after any changes constitutes your acceptance of the revised Terms. It is your responsibility to review these Terms periodically.' },
        { h: '17. Severability' },
        { p: 'If any provision of these Terms is found to be invalid, illegal, or unenforceable under applicable law, the remaining provisions shall continue in full force and effect. The invalid or unenforceable provision shall be deemed modified to the minimum extent necessary to make it valid, legal, and enforceable.' },
        { h: '18. Entire Agreement' },
        { p: 'These Terms, together with our {privacy} and any other legal notices published on this Platform, constitute the entire agreement between you and ResetWell Plus with respect to your use of the Platform and supersede all prior agreements, understandings, or arrangements.' },
        { h: '19. Contact Us' },
        { p: 'If you have any questions, concerns, or grievances regarding these Terms of Use, please reach out to our Grievance Officer as required under the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>:' },
        { p: 'ResetWell Plus LLC / ResetWell Plus Pvt. Ltd., via our {contact}.' },
        { p: 'We will endeavor to acknowledge your grievance within 24 hours and resolve it within 15 days of receipt, as required under applicable Indian law.' },
      ] as LegalNode[],
      privacyLinkText: 'Privacy Policy',
      smsLinkText: 'SMS Consent',
      contactLinkText: 'Contact Us page',
    },

    disclaimer: {
      kicker: 'Legal',
      title: 'Medical Disclaimer',
      metaTitle: 'Medical Disclaimer | ResetWell Plus',
      description:
        'The content on the ResetWell Plus website is for informational and educational purposes only and is not a substitute for professional medical advice.',
      paras: [
        'The content on this website is for informational and educational purposes only. It is not intended as a substitute for professional medical advice, diagnosis, or treatment.',
        'Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of something you have read on this website.',
        'Hormone therapy and other treatments discussed on this site may not be appropriate for every individual. A personalised consultation with a ResetWell Plus specialist is required before any treatment is initiated.',
      ],
      cta: 'Book a Consultation',
    },

    comingSoon: {
      metaTitle: 'Booking opens soon | ResetWell Plus',
      description:
        "Online booking for ResetWell Plus midlife and menopause consultations is launching soon. Leave your email and we'll let you know the moment it's live.",
      badge: 'Booking opens soon',
      heading: "We're getting the clinic ready.",
      body: "Online consultations with our menopause specialists are launching shortly. Leave your email and you'll be first to know the moment booking goes live.",
      submit: 'Notify me',
      submitting: 'Submitting\u2026',
      success: "Thank you \u2713 We'll be in touch soon.",
      tryChecker: 'Try the Symptom Checker',
    },

    book: {
      kicker: 'The Book',
      /** The book's own title, never translated. */
      title: 'Menopause & Me',
      metaTitle: 'Menopause & Me by Swati Singh | ResetWell Plus',
      description:
        "Menopause & Me: It's Time to Reclaim Your Life. An honest, science-backed guide by Swati Singh, co-founder of ResetWell Plus. Available on Amazon.",
      lede: "It's Time to Reclaim Your Life. An honest, science-backed guide by Swati Singh, co-founder of ResetWell Plus.",
      coverAlt: "3D cover of Menopause & Me: It's Time to Reclaim Your Life by Swati Singh",
      buyIndia: 'Buy on Amazon India',
      buyIntl: 'Buy on Amazon',
      buyIntlRegions: 'US/Canada/UK',
      kindle: 'Kindle edition',
      lead: "The honest, science-backed guide every woman wishes she'd had sooner.",
      /** {title} in the third paragraph becomes the italicised book title. */
      paras: [
        "It's 3 a.m. Your heart is pounding. Sleep won't come. Your mood feels foreign, your body feels borrowed, and your doctor just told you your labs are \"normal.\" Sound familiar?",
        'For generations, women have been told to grit their teeth through perimenopause and menopause. Anxiety, brain fog, joint pain, stubborn weight, vanishing libido: all waved away as "just stress" or "just aging." Meanwhile, you\'re left wondering if you\'re losing your mind. You\'re not. And you\'re not alone.',
        "{title} is the conversation you should have had a decade ago. Written by Swati Singh, co-founder of ResetWell Plus, this clear, compassionate guide pairs lived experience with the latest evidence so you can finally understand what's happening inside your body, and exactly what to do about it.",
      ],
      discoverIntro: "Inside, you'll discover:",
      discover: [
        "The early whispers of perimenopause most women miss until they're roaring",
        'The real story on HRT, stripped of outdated fear and Hollywood headlines',
        'How menopause rewires your brain, mood, sleep, bones, and sex life',
        'The nutrition and movement strategies that actually move the needle',
        'How to advocate for yourself when your doctor brushes you off',
      ],
      closing1:
        "Menopause isn't the end of your vitality. It's a transition, and you deserve to walk through it with clarity, confidence, and a plan.",
      closing2: 'Stop suffering in silence. Reclaim your energy, your sleep, your spark, your self.',
    },

    blog: {
      title: 'Our Blog',
      lede: "From the ResetWell Plus Editorial team: Straight talk on perimenopause, menopause, and midlife health - what's happening in your body, and what you can actually do about it.",
      description:
        'Articles on perimenopause and menopause symptoms, treatment options, and midlife wellness from the ResetWell Plus team.',
      keywords: 'menopause blog India, perimenopause symptoms, menopause articles',
      /** {n} is the estimated reading time in minutes. */
      readTime: '{n} min read',
      readPost: 'Read the post',
      faqHeading: 'Frequently asked questions',
      ctaHeading: 'Wondering if this is perimenopause?',
      ctaBody:
        'Take our 2-minute symptom self-assessment, or talk to a menopause specialist who will actually listen.',
      ctaChecker: 'Check Your Symptoms',
      ctaBook: 'Book a Consultation',
      backToAll: 'Back to all posts',
    },

    about: {
      kicker: 'About',
      title: 'Meet the Founders',
      metaTitle: "About ResetWell Plus | Women's Midlife & Menopause Wellness",
      description:
        "ResetWell Plus is a women's wellness platform for menopause and midlife, created by Swati Singh and Reshma Tiwari to bring clarity, compassion and community to women everywhere.",
      keywords: "about ResetWell Plus, menopause wellness India, women's midlife community",
      lede: 'A space created by women who have walked the journey themselves, determined to make sure no one else walks it alone.',
      readBio: 'Read full bio',
      /** Keys match the founder ids in the page; names and images stay there. */
      founders: {
        swati: {
          role: "Author, menopause educator, speaker & women's wellness advocate",
          creds: 'Masters in English',
        },
        reshma: {
          role: "Certified menopause coach, speaker & women's wellness advocate",
          creds: 'Masters in Business Administration',
        },
      } as Record<string, { role: string; creds: string }>,
      beganHeading: 'How it all began',
      beganParas: [
        "We are Swati and Reshma, menopause educators, motivational speakers and women's wellness advocates. After experiencing firsthand how confusing, isolating, and overlooked this stage of life can be, we made it our mission to bring clarity, compassion, and community to women everywhere.",
        'At ResetWell Plus, we break the silence. We replace fear with knowledge. We replace confusion with confidence. And we replace isolation with a supportive sisterhood.',
        'That mission lives first in our telehealth platform: real access to expert doctors, personalized hormonal care, and holistic specialists, whenever a woman needs them. We back that up with empowering events, honest conversations, and practical guidance, so every woman can understand her body and rediscover the strength and brilliance she already possesses.',
      ],
    },

    ourTeam: {
      kicker: 'About',
      title: 'Our Team',
      metaTitle: 'Our Team | ResetWell Plus',
      description:
        "Meet the clinicians and builders behind ResetWell Plus, India's expert-led platform for perimenopause and menopause care.",
      lede: 'The clinicians and builders behind ResetWell Plus.',
    },

    inThePress: {
      kicker: 'About',
      title: 'In The Press',
      metaTitle: 'In The Press | ResetWell Plus',
      description:
        "Press coverage and media features for ResetWell Plus, India's expert-led platform for perimenopause and menopause care.",
      lede: "Coverage and recognition for our work in women's midlife health.",
      readArticle: 'Read article',
      /** {link} is replaced with the linked `getInTouch` text. */
      enquiries: 'For press enquiries, {link}.',
      getInTouch: 'get in touch',
    },

    // Corporate / B2B page. English only: the page file lives outside
    // src/pages/[...locale]/ and the path is listed in EN_ONLY, so no Hindi
    // twin is built. The statistics below are the client's, each tied to a
    // source in `sources`.
    // Gated download page for the corporate one-pager. English only, same as
    // the rest of the workplace-wellness section.
    corporateOnePager: {
      kicker: 'Workplace Wellness',
      title: 'Corporate Wellness One-Pager',
      metaTitle: 'Corporate Menopause Wellness One-Pager | ResetWell Plus',
      description:
        'Get the ResetWell Plus corporate wellness one-pager: the business case for menopause support in Indian workplaces, and how the programme works.',
      keywords: 'corporate menopause one-pager, workplace menopause India, HR menopause resource',
      lede: 'The business case and the programme, in a single document you can circulate internally.',
      formHeading: 'Where should we send it?',
      formBody: 'We will email the one-pager straight away, so you have it on file to share with your team.',
      nameLabel: 'Your name',
      namePlaceholder: 'Priya Sharma',
      companyLabel: 'Company',
      companyPlaceholder: 'Your organisation',
      emailLabel: 'Work email',
      emailPlaceholder: 'you@company.com',
      submit: 'Email me the one-pager',
      sending: 'Sending\u2026',
      fineprint: 'We follow up within 48 hours with pilot options. No spam, ever.',
      successHeading: 'On its way.',
      /** {name}, {company} and {email} are filled in from the form. */
      successBody: 'Thanks, {name}. The one-pager for {company} is on its way to {email}.',
      /** Shown when this address has already been sent the one-pager. */
      successBodyRepeat:
        'Thanks, {name}. We have already sent the one-pager to {email}, so check your inbox rather than waiting for a new one.',
      readinessCta: 'Take the readiness assessment',
      contactCta: 'Talk to us about a pilot',
    },

    workplaceWellness: {
      kicker: 'Workplace Wellness',
      title: 'Partner with ResetWell Plus',
      metaTitle: 'Workplace Menopause Wellness in India | ResetWell Plus',
      description:
        'Bring expert menopause and midlife care to your organisation in India. Reduce attrition, protect productivity and build a menopause-confident culture.',
      keywords:
        'workplace wellness India, menopause at work India, employee benefits menopause, corporate menopause policy India, menopause HR India',
      lede: 'Bring expert menopause and midlife care to your organisation.',
      intro:
        'By 2030, nearly 130 million Indian women will be in the menopausal transition, many of them in your workforce right now. Most organisations have no plan for supporting them.',

      businessCase: {
        eyebrow: 'The business case',
        heading: "This isn't a wellness perk. It's a retention and productivity issue.",
        body: "India's corporate workforce includes a fast-growing number of women aged 35 to 55, often in mid-to-senior roles, managing teams and carrying institutional knowledge. Menopause in India also tends to begin earlier than the global average, around age 46 to 47, which means the impact lands squarely during peak career years. Most of these women are getting no employer support, no HR awareness, and often no clarity themselves on what's causing the symptoms they're managing at work.",
        statsHeading: 'The numbers',
        stats: [
          {
            figure: '130M',
            text: 'Indian women are projected to be in the menopausal transition by 2030: a workforce-scale demographic shift, not an individual health issue.',
          },
          {
            figure: '46 to 47',
            text: 'is the typical age Indian women reach menopause, earlier than the global average, so symptoms overlap with peak leadership and decision-making years.',
          },
          {
            figure: 'Up to 10%',
            text: 'of women globally leave senior roles specifically due to unmanaged menopause symptoms, a meaningful cost where senior female talent is already scarce.',
          },
          {
            figure: '14 days',
            text: 'a year are lost to menopause symptoms in reduced productivity per affected woman, close to three working weeks.',
          },
          {
            figure: '84%',
            text: "of women globally say more menopause support is needed at work, and 72% admit they've hidden their symptoms from colleagues or managers rather than ask for help.",
          },
          {
            figure: '1 in 10',
            text: 'women have turned down a job offer specifically due to a lack of menopause support, making this a talent-acquisition cost and not only a retention one.',
          },
          {
            figure: 'Higher burden',
            text: 'is reported by South Asian and East or Southeast Asian women than by the Western populations studied, in a 2025 APAC study across Singapore, Vietnam, Australia, Japan and Indonesia. Fatigue, brain fog and difficulty sustaining focus were the most disruptive at work.',
          },
          {
            figure: 'Only half',
            text: 'of affected women feel their symptoms have been acknowledged in any formal workplace conversation. The majority manage this silently, without disclosure.',
          },
        ] as { figure: string; text: string }[],
        reading: [
          { label: 'Why are we losing top-tier female talent at the peak of their careers?', href: '/blog/why-are-we-losing-top-tier-female-talent-at-the-peak-of-their-careers/' },
          { label: 'How to manage menopause brain fog at work', href: '/blog/manage-menopause-brain-fog-at-work/' },
        ] as { label: string; href: string }[],
      },

      whyNow: {
        eyebrow: 'Why now',
        heading: "India's workforce is changing faster than its policies are.",
        points: [
          "Women's workforce participation in India has been rising, and with it the number of women navigating perimenopause while holding senior, high-visibility roles.",
          'India currently has no national workplace menopause policy, unlike the UK, where large employers will soon be legally required to publish menopause action plans. Organisations that act now build a genuine differentiator rather than a compliance response to a future mandate.',
          'For sectors already competing hard for senior female talent, including BFSI, IT and ITES, consulting and healthcare, menopause support is becoming a visible signal in employer-of-choice conversations, the way parental leave and flexible work already are.',
        ],
        reading: [
          { label: 'Why menopause awareness matters in the workplace', href: '/blog/why-menopause-awareness-matters-in-the-workplace/' },
        ] as { label: string; href: string }[],
      },

      programme: {
        eyebrow: 'The programme',
        heading: 'The ResetWell Plus Corporate Wellness Programme',
        tiers: [
          {
            tier: 'Tier 1',
            h: 'Awareness and Education',
            p: 'Expert-led sessions for the whole organisation, covering what perimenopause is, how it shows up at work, and how colleagues and managers can support it. Delivered separately for employees, managers and HR, in English and Hindi.',
          },
          {
            tier: 'Tier 2',
            h: 'Telehealth Access Benefit',
            p: 'Subsidised or fully covered virtual consultations with ResetWell Plus specialists for eligible employees. Confidential intake, appointments outside working hours, and a written care plan within 24 hours.',
          },
          {
            tier: 'Tier 3',
            h: 'Community and Ongoing Support',
            p: 'Monthly expert Q&A, a private peer community facilitated by certified coaches, quarterly wellbeing check-ins, and a manager toolkit for inclusive, low-friction conversations.',
          },
        ] as { tier: string; h: string; p: string }[],
        note: 'Most organisations begin with a Tier 1 awareness session as a low-commitment pilot, then expand into Tier 2 telehealth access once employee interest is confirmed.',
      },

      management: {
        eyebrow: 'For management',
        heading: 'What management needs to know',
        items: [
          {
            h: 'Engagement model',
            p: 'Per-employee-per-month or a flat annual licence. Pricing is available on request, scaled to organisation size.',
          },
          {
            h: 'Implementation timeline',
            p: 'Typically live within 2 to 3 weeks of a signed agreement. No integration is required with existing insurance or benefits platforms, and it can be run bespoke.',
          },
          {
            h: 'Confidentiality',
            p: 'All consultations are confidential. HR receives only aggregate, anonymised engagement data, never individual health information.',
          },
          {
            h: "Who's eligible",
            p: 'Female employees aged 35+, or opt-in by self-identification, flexible to your existing benefits structure.',
          },
        ] as { h: string; p: string }[],
        reading: [
          { label: 'Why should HR talk about menopause?', href: '/blog/why-should-hr-talk-menopause/' },
        ] as { label: string; href: string }[],
      },

      talkToUs: {
        eyebrow: 'Next step',
        heading: 'Talk to us',
        body: 'Start with a conversation, or take something to circulate internally first.',
        primaryCta: 'Talk to us',
        secondaryCta: 'Download the Corporate Wellness one-pager',
        secondaryNote: 'For HR leaders who want to circulate internally before committing to a call.',
        tertiaryCta: 'Take the Menopause Workplace Readiness Score',
        tertiaryNote: 'Six questions, an instant benchmark, and the full report by email.',
      },

      readingHeading: 'Further reading',
      sourcesHeading: 'Sources',
      // `href` is omitted where the citation could not be traced to a primary
      // source. See the note in the two entries below.
      sources: [
        { text: 'British Menopause Society, senior role attrition (10%).' },
        { text: 'Nuffield Health, UK, productivity loss (14 working days a year).' },
        {
          text: 'Catalyst, 2024 global survey: 84% want more support, 72% have hidden symptoms, 1 in 10 declined a job offer.',
          href: 'https://www.catalyst.org/en-us/about/newsroom/2024/menopause-workplace-support-global',
        },
        {
          text: 'BJOG (Kaushik et al.), 2026, India-specific: 130M women by 2030, earlier onset age (46 to 47), no national menopause policy.',
          href: 'https://obgyn.onlinelibrary.wiley.com/doi/10.1111/1471-0528.70272',
        },
        {
          text: 'NUS Medicine and HeyVenus, 2025 APAC white paper: South, East and Southeast Asian symptom burden higher than Western comparators.',
          href: 'https://medicine.nus.edu.sg/wp-content/uploads/2025/04/2025-04-17-NUS-Medicine-and-HeyVenus-study-Menopause-is-a-Critical-Workplace-Challenge-for-APAC-Business-Leaders.pdf',
        },
      ] as { text: string; href?: string }[],
    },

    // Copy for the corporate readiness assessment. English only: the page lives
    // outside src/pages/[...locale]/ and is listed in EN_ONLY, so no Hindi twin
    // is built and the language toggle is hidden on it.
    workplaceReadiness: {
      kicker: 'About',
      title: 'Menopause Workplace Readiness Score',
      metaTitle: 'Menopause Workplace Readiness Score | ResetWell Plus',
      description:
        'A free six-question assessment for HR and CXO leaders in India. See where your organisation stands on supporting women 45+, and where the attrition risk is hiding.',
      keywords:
        'menopause workplace policy India, HR menopause assessment, employee retention women 45+, workplace readiness score',
      lede: 'Six questions. See where your organisation stands on supporting women 45+, and where the attrition risk is hiding.',

      // Intro panel
      introHeading: 'Before you start',
      introBody:
        'Answer six yes/no questions about your organisation. You will get an instant readiness score, a breakdown of where the gaps are, and the full benchmark report by email.',
      stats: [
        { value: '60 sec', label: 'to complete' },
        { value: '6', label: 'questions' },
        { value: 'Instant', label: 'benchmark' },
      ] as { value: string; label: string }[],
      start: 'Start the assessment',
      introFineprint:
        'Built for HR and CXO leaders. Your answers benchmark your organisation, not any individual.',

      // Question flow
      questionCounter: 'Question {n} of {total}',
      whyLabel: 'Why this matters',
      yes: 'Yes',
      no: 'No',
      back: 'Back',
      questions: {
        policy: {
          text: 'Do you have a written policy addressing menopause or midlife health?',
          why: 'Written policy signals the topic is safe to raise. Without it, most employees stay silent.',
        },
        hrtCoverage: {
          text: 'Do your health benefits cover HRT consultations?',
          why: 'Hormone therapy is the clinical front line of care. Coverage gaps push women to suffer through symptoms untreated.',
        },
        attritionTracked: {
          text: 'Have you tracked attrition among women 45+ in the last 2 years?',
          why: "You can't fix a leak you haven't measured. This is usually the first blind spot.",
        },
        managerTraining: {
          text: 'Are managers trained to recognise and support menopause-related needs?',
          why: 'Frontline managers make or break retention. Untrained managers misread symptoms as performance issues.',
        },
        flexibility: {
          text: 'Do you offer flexible or remote options tied to health needs?',
          why: "Flexibility is the lowest-cost, highest-impact lever most companies already have, but don't formally connect to this.",
        },
        leadershipVoice: {
          text: 'Has leadership ever publicly discussed menopause as a workplace issue?',
          why: 'Visibility from the top is what actually changes whether employees feel safe asking for support.',
        },
      } as Record<string, { text: string; why: string }>,

      // Results
      resultsHeading: 'Your readiness score',
      outOf: 'out of {total}',
      tiers: {
        reactive: {
          label: 'Reactive',
          copy: "Menopause isn't yet on your workplace agenda. That's true for most of India Inc. right now, which means there's a real first-mover advantage in fixing it early.",
        },
        developing: {
          label: 'Developing',
          copy: "You've made a start. A few structural gaps in policy, training or measurement could still be quietly costing you senior women leaders.",
        },
        leading: {
          label: 'Leading',
          copy: "You're ahead of most companies. Formalising what you're already doing turns it into a retention story you can put in front of your board.",
        },
      } as Record<string, { label: string; copy: string }>,
      breakdownHeading: 'Where the gaps are',
      inPlace: 'In place',
      gap: 'Gap',
      retake: 'Retake the assessment',

      // Lead form
      formHeading: 'Get the full benchmark report',
      formBody: 'We will email you the ResetWell Plus State of Menopause report along with your score.',
      nameLabel: 'Your name',
      namePlaceholder: 'Priya Sharma',
      companyLabel: 'Company',
      companyPlaceholder: 'Your organisation',
      emailLabel: 'Work email',
      emailPlaceholder: 'you@company.com',
      submit: 'Email me the benchmark report',
      sending: 'Sending…',
      formFineprint: "We follow up within 48 hours with pilot options. No spam, ever.",

      // Thank-you panel
      successHeading: "You're on the list.",
      /** {name}, {company} and {email} are filled in from the form. */
      successBody: 'Thanks, {name}. The benchmark report for {company} is on its way to {email}.',
      /** Shown when this address has already been sent the report once. */
      successBodyRepeat:
        'Thanks, {name}. We have updated the score for {company}. The report has already been sent to {email}, so check your inbox rather than waiting for a new one.',
      talkToUs: 'Talk to us about a pilot',
    },

    ourStory: {
      kicker: 'About',
      title: 'Our Story',
      metaTitle: 'Our Story | ResetWell Plus',
      description:
        'Why we built ResetWell Plus: expert-led, culturally honest menopause and hormonal health care for the 103 million Indian women the system overlooks.',
      keywords: 'ResetWell Plus story, menopause care India, hormonal health platform India, menopause mission',
      lede: 'Why we built the midlife care women deserve.',
      imageAlt:
        'The ResetWell Plus founding team discussing the telehealth platform at a whiteboard in a warmly lit office',
      introLead: "In India, menopause is still whispered about, if it's discussed at all.",
      introPara:
        "Millions of women are navigating hormonal transitions in their late 30s and 40s with symptoms their doctors dismiss, their families don't understand, and their own bodies can barely explain. ResetWell Plus was built in response to that silence. And to the 103 million Indian women who deserve better than it.",
      missionLabel: 'Mission',
      missionText:
        'Our mission: to make expert menopause and hormonal health care accessible, culturally honest, and warmly supported, for every woman, wherever she is.',
      purposeHeading: 'Our Founding Purpose',
      purposeParas: [
        "ResetWell Plus began with a question that had no good answer: why is menopause the only major biological transition in a woman's life that our healthcare system treats as invisible?",
        'Our founders Reshma Tiwari and Swati Singh came together not for a market opportunity but a personal recognition: that the women around them, mothers, colleagues, patients, friends, were suffering silently through a transition that had real medical causes and real medical solutions, and they had no access to either.',
        'ResetWell Plus was built to be the platform they wished had existed. Not a supplement brand. Not a general telehealth service. A dedicated, expert-led, culturally grounded ecosystem for Indian women navigating hormonal health transitions.',
      ],
      diffHeading: 'How ResetWell Plus Is Different',
      diffItems: [
        'We combine what no other platform offers together: expert-led events, specialist virtual consultations, and a facilitated community, in one place, in India, for Indian women.',
        'Our specialists are specifically trained in perimenopause and menopause. This is not a sideline of their general practice, it is their focus.',
        "We acknowledge India's cultural context. The symptoms differ. The stigma differs. The family dynamics differ. Our care reflects that.",
        'We serve all of India, not just metros. Virtual-first means a woman in Patna has the same access as a woman in Mumbai.',
      ],
      pillarsHeading: 'Our Approach: Three Pillars',
      pillars: [
        {
          h: 'Evidence-Based Care',
          p: 'Every treatment we recommend is grounded in current clinical evidence, reviewed regularly by our medical advisors. We do not speculate or use wellness language to avoid clinical responsibility.',
        },
        {
          h: 'Cultural Integration',
          p: 'We understand that menopause in India arrives inside a web of family expectations, traditional beliefs, and institutional silence. Our care acknowledges all of this, and helps women navigate it on their own terms.',
        },
        {
          h: 'Individual Plans',
          p: "Every woman's perimenopause is different. Her symptoms, health history, family, cultural context, and preferences, all of it shapes her care plan. There is no standard protocol.",
        },
      ] as { h: string; p: string }[],
      commitmentHeading: 'Our Commitment',
      commitmentPara:
        'We commit to being honest when answers are complicated. We will not pretend that menopause care is simple, that HRT is right for everyone, or that a single event or supplement will solve everything. What we will do is give every woman who comes to ResetWell Plus the clearest, most honest picture of her options, and stand beside her as she navigates them.',
      commitmentQuoteIntro:
        'We measure our success not by the number of appointments booked, but by how many Indian women reach us saying:',
      commitmentQuote: '"This was the first place where someone actually heard me."',
      cta: 'Book a Consultation',
    },

    swatiSingh: {
      kicker: 'About',
      title: 'Swati Singh',
      metaTitle: 'Swati Singh | ResetWell Plus',
      description:
        "Swati Singh, co-founder of ResetWell Plus: author, menopause educator, speaker and women's wellness advocate.",
      lede: "Author, menopause educator, speaker & women's wellness advocate.",
      jobTitle: 'Co-founder',
      schemaDescription:
        "Author of Menopause & Me, menopause educator, speaker and women's wellness advocate.",
      /** {book} in the third paragraph becomes a link to /book/. */
      paras: [
        "Swati Singh is an author, women's health and wellness advocate, and the co-founder of ResetWell Plus, a platform on a mission to change the face of menopause care in India.",
        "Her journey began the way it does for so many women: suddenly, and without warning. A lifelong health and fitness enthusiast, Swati's life was turned upside down when menopause struck, leaving her on temporary disability, navigating a confusing US medical system that had few real answers. With determination and self-advocacy, she charted her own path to menopause care and wellness. And today, she is thriving, with a body and mind that feel decades younger than her years.",
        "That experience became her calling. She wrote {book} to give women what she didn't have: a clear, honest guide that reminds them they don't need to be doctors to take charge of their own bodies: they need to reclaim their lives and thrive in their second innings.",
        'That same conviction is the foundation of ResetWell Plus, the platform she co-founded to bring accessible menopause care to women across India, while building awareness in the South Asian community in the US through podcasts, webinars, talks, panels, and in-person events on women\'s midlife wellness. A sought-after voice on midlife and menopause, Swati along with Reshma, through ResetWell Plus, is inspiring women to challenge the status quo, break the silence around menopause, and step boldly into the most powerful chapter of their lives.',
      ],
      bookTitle: 'Menopause & Me',
    },

    reshmaTiwari: {
      kicker: 'About',
      title: 'Reshma Tiwari',
      metaTitle: 'Reshma Tiwari | ResetWell Plus',
      description:
        "Reshma Tiwari, co-founder of ResetWell Plus: certified menopause coach, speaker and women's wellness advocate.",
      lede: "Certified menopause coach, speaker & women's wellness advocate.",
      jobTitle: 'Co-founder',
      schemaDescription: "Certified menopause coach, speaker and women's wellness advocate.",
      /** {swati} in the fourth paragraph becomes a link to her page. */
      paras: [
        "Reshma Tiwari is co-founder of ResetWell Plus, a platform built to revolutionize women's wellness in India, starting with menopause care. By day, she's a senior corporate finance executive, where she's spent 20 plus years commanding leadership meetings and boardrooms with confidence and precision.",
        'Then perimenopause arrived, unannounced. Brain fog, sudden acne, hair loss, incontinence and joint pain that threatened her active lifestyle. For a high-performing executive, the quiet erosion of confidence was the hardest symptom of all.',
        'The experience hit close to home. Reshma grew up in a household shaped by medicine: her father, a devoted physician, instilled in her a deep reverence for health and humanity. Yet right beside him, her mother endured her own menopause journey silently, with no language for what she was going through. When Reshma later co-founded ResetWell Plus, her mother\'s reaction was immediate: "I wish you had started this ten years earlier." Those words became fuel for everything that followed.',
        'Having found her own way back to vitality through targeted hormonal solutions, Reshma partnered with another passionate wellness advocate {swati} to turn that experience into something larger. Together, the duo have founded ResetWell Plus to break the cultural silence around menopause. "Women deserve to navigate midlife health with clarity, compassion, and science," says Reshma Tiwari. "ResetWell Plus is building an ecosystem where women can reclaim their confidence and understand their bodies on their own terms."',
        'Reshma is a wife to a deeply supportive husband, a mother of two teenage sons (her "gems"), and a competitive pickleball player off the clock, and a living example of what happens when women refuse to just "live with" their symptoms. ResetWell Plus offers a personalized, holistic mix of hormonal and non-hormonal solutions, so every woman has a tailored path into the most powerful chapter of her life.',
      ],
    },

    eventsUpcoming: {
      kicker: 'Events',
      title: 'Upcoming Events',
      lede: 'Live, expert-led sessions you can join from anywhere.',
    },

    eventsOnDemand: {
      kicker: 'Events',
      title: 'On Demand',
      lede: 'Watch past sessions anytime, at your own pace.',
    },

    forCorporates: {
      kicker: 'Events',
      title: 'ResetWell Plus for Employers',
      metaTitle: 'Menopause at Work: Corporate Wellness in India | ResetWell Plus',
      description:
        'Bring expert menopause and midlife care to your workplace in India: workshops, webinars, subsidised employee consultations and policy support.',
      keywords: 'menopause at work India, workplace wellness India, corporate menopause programme',
      lede: 'Offer expert midlife care as part of your benefits package.',
      blocks: [
        {
          h: 'Workshops & webinars',
          p: 'Live, expert-led sessions tailored to your teams, from perimenopause basics to manager training.',
        },
        {
          h: 'Subsidised employee visits',
          p: 'Offer your people direct access to specialist consultations as part of their benefits.',
        },
        {
          h: 'Policy & culture support',
          p: 'Practical guidance to make your workplace genuinely menopause-confident.',
        },
      ] as { h: string; p: string }[],
      cta: 'Talk to our team',
    },

    communityJoin: {
      title: 'Join the Community',
      metaTitle: 'Menopause Community for Indian Women | ResetWell Plus',
      description:
        'Join a private, expert-facilitated menopause and perimenopause community for Indian women. Peer support in English and Hindi, on WhatsApp, Instagram and more.',
      keywords: 'menopause community India women, menopause support group India, perimenopause community',
      lede: 'A private, moderated, judgement-free space for women who get it. Join free, then connect with us wherever you already are.',
      /** Keys match the channel ids in the page; the URLs stay in seo.ts. */
      channels: {
        whatsapp: {
          name: 'WhatsApp Community',
          find: 'Daily wellness tips, event alerts, community questions, and peer support in English and Hindi. Moderated by our care team.',
          cta: 'Join the WhatsApp Community',
        },
        instagram: {
          name: 'Instagram & Facebook',
          find: 'Educational reels, specialist Q&A clips, real stories from our community, and event previews. In Hinglish.',
          cta: 'Follow on Instagram',
        },
        linkedin: {
          name: 'LinkedIn',
          find: 'Corporate wellness content, research updates, and B2B resources for HR leaders.',
          cta: 'Follow on LinkedIn',
        },
        youtube: {
          name: 'YouTube',
          find: 'Full recordings of past events, specialist explainer series, podcasts, and patient story documentaries. Free to watch.',
          cta: 'Subscribe on YouTube',
        },
      } as Record<string, { name: string; find: string; cta: string }>,
    },

    storiesOfReset: {
      kicker: 'Community',
      title: 'True Stories of Transformation',
      lede: 'Real women on the turning points that changed everything.',
    },

    faqs: {
      metaTitle: 'Menopause & Perimenopause FAQs | ResetWell Plus',
      description:
        'Straight answers to the questions women actually ask about perimenopause and menopause: symptoms, HRT safety, non-hormonal options, sexual and urinary health, early menopause, and long-term health.',
      keywords:
        'is HRT safe, menopause FAQ, perimenopause questions, menopause age, HRT breast cancer risk, vaginal estrogen safety',
      heading: 'Frequently Asked Questions',
      lede: 'Straight answers about the transition, treatment and long-term health, informed by current clinical guidance.',
    },

    symptomChecker: {
      kicker: 'Is it perimenopause?',
      title: "Something has shifted. Let's understand what your body is telling you.",
      metaTitle: 'Free Perimenopause Symptom Checker & Quiz (India) | ResetWell Plus',
      description:
        'Take our free 5-minute perimenopause quiz, adapted for India. Check symptoms like joint pain, sleep, mood and hot flashes, and get a personalised next step. No sign-up.',
      keywords:
        'perimenopause quiz India, menopause symptom checker, perimenopause symptoms quiz, menopause joint pain India',
      lede: "This is not a medical diagnosis, only a specialist can provide that. But this 5-minute assessment will help you make sense of what you've been experiencing, understand whether your symptoms align with perimenopause, and know exactly what to discuss at your first consultation. It is free, private, and takes 5 minutes.",
      schemaName: 'Perimenopause Symptom Checker',
      schemaDescription:
        'A free 5-minute perimenopause self-assessment adapted for women in India. Not a diagnosis; a starting point for a specialist conversation.',
    },
  },

  /** Full FAQ library shown on /community/faqs, grouped into themed buckets. */
  faqLibrary: {
    sections: [
      {
        title: 'Understanding the Transition',
        items: [
          {
            q: "What's the difference between perimenopause, menopause, and postmenopause?",
            a: "Perimenopause is the transition leading up to menopause, when hormone levels fluctuate and symptoms often begin. You are still having periods, even if they're irregular. Menopause is a single point in time: the day you've gone 12 consecutive months without a period (average age around 51 to 52). Everything after that day is postmenopause. Most of the years women spend \"in menopause\" are actually perimenopause and postmenopause.",
          },
          {
            q: 'How long does perimenopause last?',
            a: 'It varies widely, but it commonly lasts four to eight years. Some women notice changes for only a year or two; others experience symptoms for a decade. The unpredictability is one of the most frustrating parts, which is why tracking your symptoms is so useful.',
          },
          {
            q: "Can I be in perimenopause if I'm still getting my period?",
            a: 'Yes, and this is one of the most under-recognized facts. You can have regular or irregular periods and still be deep in perimenopause with significant symptoms. Hormonal shifts begin long before periods stop.',
          },
          {
            q: "I'm in my early 40s (or late 30s). Am I too young for this?",
            a: 'Probably not. Perimenopause commonly begins in the early-to-mid 40s, and for some women in their late 30s. Symptoms appearing at this age are frequently dismissed or misattributed. Recognizing them early is empowering, not alarming. (Menopause before 40 is called premature menopause or primary ovarian insufficiency and deserves specific medical attention, see the section on special situations.)',
          },
          {
            q: "Why did my doctor say a blood test can't diagnose perimenopause?",
            a: "Because hormone levels (especially FSH) swing dramatically day to day during perimenopause, a single blood test is unreliable and can be normal even when you're clearly symptomatic. For most women over 45, diagnosis is based on symptoms and cycle changes, not bloodwork. Testing is mainly useful when menopause is suspected before age 40 to 45.",
          },
        ],
      },
      {
        title: 'Symptoms You Might Not Realize Are Connected',
        items: [
          {
            q: 'What symptoms actually count as menopause symptoms?',
            a: 'Far more than hot flashes. Beyond hot flashes and night sweats, common symptoms include sleep disruption, anxiety, low mood, irritability or "rage," brain fog and memory lapses, joint and muscle aches, heart palpitations, headaches, vaginal dryness, urinary changes and recurrent UTIs, reduced libido, skin and hair changes, and shifts in where the body stores fat.',
          },
          {
            q: 'Is the "brain fog" real, and is it permanent?',
            a: "It's very real and well-documented: difficulty with word-finding, concentration, and short-term memory. The reassuring part is that for most women it is temporary, tied to the hormonal turbulence of the transition, and tends to improve in postmenopause. It is not early dementia, though it understandably can feel that way.",
          },
          {
            q: 'Why do I feel so anxious, irritable, or low? Is menopause affecting my mental health?',
            a: 'Hormonal changes directly influence mood-regulating brain chemistry, and many women experience new or worsened anxiety, irritability, low mood, or a short fuse during perimenopause, often before they connect it to hormones. Disrupted sleep amplifies all of it. This is a recognized part of the transition and is treatable, not a personal failing.',
          },
          {
            q: 'Are joint aches, palpitations, or a frozen shoulder really part of this?',
            a: 'They can be. Estrogen affects joints, connective tissue, and the cardiovascular system, so new aches, stiffness, palpitations, and even frozen shoulder are reported during this time. Palpitations and any chest symptoms should always be checked by a clinician to rule out other causes, but menopause is a genuine and often-overlooked contributor.',
          },
          {
            q: 'Will my symptoms ever end?',
            a: "Most symptoms ease in the years after menopause, though hot flashes can persist for several years and, for some women, longer. Genitourinary symptoms (vaginal and urinary) are the exception: they tend to be chronic and progressive without treatment, because they're driven by ongoing low estrogen in those tissues.",
          },
        ],
      },
      {
        title: 'Hormone Therapy (HRT/MHT): The Questions Everyone Has',
        items: [
          {
            q: "Isn't HRT dangerous? Didn't a big study link it to breast cancer?",
            a: "This is the single biggest source of fear, and it's based on early interpretations of the 2002 Women's Health Initiative study, which involved older women, higher doses, and older formulations than are typically used today. Current consensus from The Menopause Society is that for most healthy women under 60 or within 10 years of menopause, the benefits of hormone therapy outweigh the risks. In 2025, the FDA removed the long-standing boxed warnings on menopausal hormone therapy after reevaluating that older data.",
          },
          {
            q: 'So what is the actual breast cancer risk?',
            a: "It's smaller and more nuanced than the headlines suggest. Estrogen-only therapy (for women without a uterus) has not been shown to increase breast cancer risk and may even slightly lower it. Combined estrogen-progestogen therapy is not associated with a meaningful increase in the first several years of use; a small increase may appear with longer-term use. For perspective, this added risk is comparable to or smaller than lifestyle factors like regular alcohol intake. Personal and family history matter, so this should be discussed individually.",
          },
          {
            q: 'Is there a "window", a best time to start HRT?',
            a: 'Yes. The evidence favors starting within about 10 years of menopause or before age 60, when the benefit-to-risk balance is most favorable (the "timing hypothesis"). Starting many years after menopause changes that balance, particularly for cardiovascular considerations.',
          },
          {
            q: 'How long can I stay on HRT? Do I have to stop at a certain age?',
            a: 'There is no mandatory stop date or arbitrary age cutoff. Guidance has moved away from "lowest dose for shortest time" toward individualized, periodic review of your benefits and risks with your clinician. Many women continue safely for years; the decision is revisited over time, not forced.',
          },
          {
            q: 'What\'s the difference between "body-identical," "bioidentical," and "synthetic" hormones?',
            a: 'Body-identical (or bioidentical) hormones are FDA-approved forms, such as estradiol and micronized progesterone, that are molecularly identical to the hormones your body once produced. These are regulated and well-studied. This is different from custom-compounded "bioidentical" hormones and pellets, which are unregulated, not FDA-approved, and discouraged by The Menopause Society due to safety and consistency concerns.',
          },
          {
            q: 'Why does the form matter: patch vs. pill vs. gel?',
            a: 'The route of delivery affects the risk profile. Estrogen delivered through the skin (patch, gel, or spray) bypasses the liver and is generally associated with a lower risk of blood clots than oral estrogen, which is why it is often preferred, especially for women with certain risk factors. Your clinician can match the form to your health profile.',
          },
          {
            q: 'If I have a uterus, why do I need progesterone too?',
            a: "Estrogen alone can thicken and overstimulate the uterine lining, raising the risk of uterine cancer. Adding progesterone (often micronized progesterone) protects the lining. Women without a uterus typically don't need it.",
          },
          {
            q: 'Will HRT make me gain weight?',
            a: 'This is a common worry, but hormone therapy is not shown to cause weight gain. Menopause itself is associated with a shift toward storing more fat around the abdomen, regardless of HRT, and some evidence suggests hormone therapy may actually help with that redistribution. Weight management in midlife is driven more by muscle loss, sleep, and lifestyle than by HRT.',
          },
          {
            q: 'Can HRT help with anything besides hot flashes?',
            a: "Yes. It's the most effective treatment for hot flashes and night sweats and for genitourinary symptoms, and it's proven to prevent bone loss and fractures. Many women also report improvements in sleep, mood, joint comfort, and skin. It is not a cure-all, and benefits vary by individual.",
          },
          {
            q: 'Who should not take HRT?',
            a: "HRT isn't suitable for everyone. It's generally not recommended for women with a current or past history of breast cancer or certain hormone-sensitive cancers, unexplained vaginal bleeding, active liver disease, or a history of certain blood clots or stroke, among others. This is exactly the kind of decision that requires a clinician who knows your full history.",
          },
        ],
      },
      {
        title: 'Non-Hormonal and Newer Options',
        items: [
          {
            q: "I can't or don't want to take hormones. What are my options?",
            a: 'There are effective non-hormonal paths. These include two newer prescription medications developed specifically for hot flashes, certain antidepressants (SSRIs/SNRIs) at low doses, gabapentin, cognitive behavioral therapy (CBT), and evidence-based lifestyle strategies. Vaginal symptoms can be treated locally without systemic hormones.',
          },
          {
            q: 'Do natural supplements and "menopause" products work?',
            a: 'Evidence for most over-the-counter supplements (such as black cohosh or soy isoflavones) is mixed and generally weak, and "natural" does not guarantee safe: some interact with medications. We encourage caution and a conversation with a clinician before spending on unproven products, especially compounded hormone pellets marketed as natural.',
          },
        ],
      },
      {
        title: 'Sexual and Urinary Health',
        items: [
          {
            q: 'Vaginal dryness and painful sex started after menopause. Is this permanent?',
            a: 'These are part of the genitourinary syndrome of menopause (GSM), caused by declining estrogen in vaginal and urinary tissues. Unlike hot flashes, GSM tends to be chronic and to worsen over time without treatment. But it responds very well to treatment, so it does not have to be permanent.',
          },
          {
            q: 'Is vaginal estrogen safe? It still says "estrogen."',
            a: 'Low-dose vaginal estrogen works locally with minimal absorption into the bloodstream, and carries minimal to no increased risk of breast or uterine cancer. It is considered safe for most women and can dramatically improve comfort, sex, and urinary symptoms. Even many breast cancer survivors may use it when non-hormonal options have not worked, a decision made together with their oncologist.',
          },
          {
            q: 'Why do I keep getting UTIs now?',
            a: 'Recurrent urinary tract infections and urinary urgency are part of GSM: the same estrogen decline that affects vaginal tissue also affects the urinary tract. Treating the underlying tissue changes (often with local vaginal estrogen) can reduce recurrent UTIs, not just the discomfort.',
          },
          {
            q: 'My libido dropped. Is there anything that helps?',
            a: 'Low libido in midlife has many contributors: hormones, sleep, mood, relationship factors, and comfort during sex. Treating GSM and sleep often helps significantly. For some women with distressing low desire that has not responded to other measures, testosterone therapy may be considered (often off-label, under specialist guidance).',
          },
        ],
      },
      {
        title: 'Long-Term Health',
        items: [
          {
            q: 'What does menopause mean for my bones?',
            a: 'Estrogen protects bone, so its decline accelerates bone loss and raises the risk of osteoporosis and fractures. Hormone therapy is proven to prevent this loss, and weight-bearing and strength exercise, adequate calcium and vitamin D, and not smoking all help. Bone density screening becomes important in this stage of life.',
          },
          {
            q: 'Does menopause affect my heart health?',
            a: "Cardiovascular risk rises after menopause as estrogen's protective effect fades. This makes midlife a critical window for attention to blood pressure, cholesterol, blood sugar, activity, and weight. When started near menopause, hormone therapy is not harmful to the heart and may be favorable; starting it much later is a different conversation.",
          },
          {
            q: "Is forgetfulness now a sign I'll get dementia later?",
            a: 'Menopausal brain fog is not the same as dementia and usually improves. While long-term brain health deserves attention through exercise, sleep, cardiovascular health, and mental engagement, the short-term cognitive symptoms of the transition are not a reliable predictor of future dementia.',
          },
        ],
      },
      {
        title: 'Special Situations',
        items: [
          {
            q: 'I went through menopause early (before 40 to 45). Is that different?',
            a: "Yes, and it matters. Early or premature menopause (including primary ovarian insufficiency) carries higher long-term risks to bone, heart, and brain health because of the longer time without estrogen. Unless there's a specific contraindication, hormone therapy is generally recommended at least until the average age of natural menopause (around 52). This is replacement of what the body would normally have, not optional treatment.",
          },
          {
            q: 'I had my ovaries removed (surgical menopause). What should I know?',
            a: 'Surgery that removes the ovaries causes an abrupt, often intense menopause rather than a gradual transition. Symptoms can be sudden and severe, and the same long-term health considerations as early menopause apply. Hormone therapy is frequently recommended unless contraindicated; discuss timing and options with your clinician.',
          },
          {
            q: "I'm a breast cancer survivor. Are all my options closed?",
            a: 'Not entirely. Systemic hormone therapy is generally avoided after breast cancer, but you still have effective non-hormonal options for hot flashes, and low-dose vaginal estrogen may be considered for severe genitourinary symptoms when non-hormonal measures fail, always in partnership with your oncologist. You deserve symptom relief; the path is just more tailored.',
          },
          {
            q: 'Do I still need contraception during perimenopause?',
            a: "Yes. You can still ovulate and conceive during perimenopause, even with irregular periods. Contraception is generally advised until you've had 12 months without a period (or per your clinician's guidance based on age). Some contraceptive methods can also help manage perimenopausal symptoms.",
          },
        ],
      },
      {
        title: 'Practical & Lifestyle',
        items: [
          {
            q: 'What lifestyle changes genuinely help?',
            a: "The most evidence-backed steps are regular exercise (especially strength training to preserve muscle and bone), prioritizing sleep, limiting alcohol and caffeine if they trigger symptoms, not smoking, managing stress, and a balanced diet with adequate protein, calcium, and vitamin D. These won't replace medical treatment for significant symptoms, but they meaningfully improve how you feel and protect long-term health.",
          },
          {
            q: 'When should I see a specialist instead of managing this alone?',
            a: "Consider expert support if symptoms are disrupting your work, sleep, relationships, or quality of life; if you're unsure whether HRT is right for you; if you had early or surgical menopause; if you have a complex health history; or if you simply want clear, personalized answers. That's precisely what ResetWell Plus is here for: connecting you with knowledgeable, up-to-date menopause care.",
          },
        ],
      },
    ] as FaqSectionCopy[],

    /** Shown in small type at the end of the FAQ page. */
    sourcesNote:
      'Sources informing these answers include The Menopause Society 2022 Hormone Therapy Position Statement and its statement on hormone therapy misinformation, the International Menopause Society 2024 White Paper, and FDA decisions through 2025. Guidance evolves; we update this resource as the science does.',
  },
};
