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
      title: 'Meet our specialists',
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
      title: 'Simple, transparent pricing',
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
