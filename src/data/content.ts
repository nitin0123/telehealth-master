// Shared content used across the homepage and inner pages.
// Edit here to update copy site-wide. Replace with a CMS/API later if desired.

export const stats = [
  { value: '30 min', label: 'unhurried specialist visit' },
  { value: '₹1,599', label: 'flat consultation fee' },
];

export interface CareNeed {
  title: string;
  href: string;
  img: string;
  blurb: string;
}
export const careNeeds: CareNeed[] = [
  { title: 'Perimenopause', href: '/understand-your-symptoms/perimenopause-101', img: '/illustrations/perimenopause.jpeg', blurb: 'The early years of change, explained.' },
  { title: 'Menopause', href: '/community/faqs', img: '/illustrations/menopause.jpeg', blurb: 'Care for the transition and beyond.' },
  { title: 'Sleep', href: '/community/faqs', img: '/illustrations/sleep.jpeg', blurb: 'Rest that actually restores you.' },
  { title: 'Mood & Memory', href: '/community/faqs', img: '/illustrations/mood-memory.jpeg', blurb: 'Steadier mood, sharper focus.' },
  { title: 'Weight', href: '/community/faqs', img: '/illustrations/weight.jpeg', blurb: 'Midlife metabolism, understood.' },
  { title: 'Hair & Skin', href: '/community/faqs', img: '/illustrations/hair-skin.jpeg', blurb: 'Hormonal changes, addressed.' },
  { title: 'Sexual Wellness', href: '/community/faqs', img: '/illustrations/sexual-wellness.jpeg', blurb: 'Intimacy and comfort, restored.' },
  { title: 'Bone & Heart', href: '/get-care/how-it-works', img: '/illustrations/bone-heart.jpeg', blurb: 'Protect your long-term health.' },
];

export interface Step {
  n: string;
  title: string;
  body: string;
}
export const steps: Step[] = [
  { n: '1', title: 'Book your visit', body: 'Pick a time that suits you and pay a flat, transparent fee.' },
  { n: '2', title: 'Meet your specialist', body: 'Join a virtual visit to discuss your health history, symptoms and goals, and get your questions answered.' },
  { n: '3', title: 'Start your care plan', body: 'Your clinician designs a personalised, holistic plan and supports your progress at every step.' },
];

export interface Specialist {
  name: string;
  role: string;
}
export const specialists: Specialist[] = [
  { name: 'Dr. Ananya Rao', role: 'Menopause Specialist' },
  { name: 'Dr. Sara Mathew', role: 'Endocrinologist' },
  { name: 'Priya Nair', role: 'Menopause Nutritionist' },
  { name: 'Dr. Leela Menon', role: "Women's Health Lead" },
];

export interface Testimonial {
  quote: string;
  name: string;
  feature?: boolean;
}
export const testimonials: Testimonial[] = [
  { quote: 'For the first time, a clinician actually listened. By the end of the day my prescription was sorted.', name: 'Meera, 49' },
  { quote: 'Within two weeks my hot flushes were gone. I feel like I can breathe again.', name: 'Anjali, 47', feature: true },
  { quote: 'Clear, flat pricing and my clinician was kind and thorough. I felt heard.', name: 'Fatima, 52' },
  { quote: 'I spent years being dismissed. Finally, a team that knows how to help.', name: 'Libby, 51', feature: true },
  { quote: "My joint pain subsided, I'm sleeping better, my moods levelled out. Best I've felt in a year.", name: 'Diana, 53' },
  { quote: 'The care was more than I could have hoped for. I finally feel like myself.', name: 'Sabrina, 46' },
];

export interface Faq {
  q: string;
  a: string;
}
export const faqs: Faq[] = [
  { q: 'Do I need a referral to book?', a: "No referral needed. Book directly and we'll handle everything from there." },
  { q: 'How does payment work?', a: 'We charge patients directly, a flat transparent fee per consultation, with no insurance paperwork or hidden costs. See the Pricing page for details.' },
  { q: 'Online or in person?', a: 'All consultations are online, so you can get expert care from wherever you are.' },
  { q: 'What does it cost?', a: 'Consultations start at ₹1,599. See the Pricing page for full details.' },
];

/** A themed bucket of FAQs for the /community/faqs page. */
export interface FaqSection {
  title: string;
  items: Faq[];
}

// Full FAQ library shown on /community/faqs, grouped into themed buckets.
// (The short `faqs` list above stays as the homepage pre-booking FAQ.)
export const faqSections: FaqSection[] = [
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
];

/** Shown in small type at the end of the FAQ page. */
export const faqSourcesNote =
  'Sources informing these answers include The Menopause Society 2022 Hormone Therapy Position Statement and its statement on hormone therapy misinformation, the International Menopause Society 2024 White Paper, and FDA decisions through 2025. Guidance evolves; we update this resource as the science does.';

export interface EventItem {
  title: string;
  meta: string;
  tag: string;
}
// No live events scheduled right now: the upcoming-events page shows its
// "coming soon" state until an entry tagged 'Live · Online' is added here,
// e.g. { title: '…', meta: 'Tue, 8 Jul · 7:00 PM IST · Live online', tag: 'Live · Online' }.
export const events: EventItem[] = [
  { title: 'HRT: Myths vs Facts', meta: 'On demand · 48 min', tag: 'On Demand' },
  { title: 'Strength & Bones', meta: 'On demand · 35 min', tag: 'On Demand' },
];

export interface OnDemandVideo {
  /** Video title, shown as the card title */
  title: string;
  /** Full YouTube watch URL */
  href: string;
  /** Thumbnail in public/, e.g. '/yt-pIMAaq4ur2U.jpg' */
  img: string;
  /** Date the video was posted, e.g. '30 Jun 2026' */
  date: string;
}
export const onDemandVideos: OnDemandVideo[] = [
  {
    title: 'Perimenopause: What No One Tells Women About This Transition',
    href: 'https://www.youtube.com/watch?v=pIMAaq4ur2U',
    img: '/yt-pIMAaq4ur2U.jpg',
    date: '30 Jun 2026',
  },
  {
    title: 'The Hidden Oral Symptoms of Menopause Every Woman Should Know',
    href: 'https://www.youtube.com/watch?v=-KA06dsUXK4',
    img: '/yt--KA06dsUXK4.jpg',
    date: '19 May 2026',
  },
  {
    title: 'Menopause, Joint Pain, and YOU: The Solutions You Need! With Dr. Jodi Thomas',
    href: 'https://www.youtube.com/watch?v=LqFxWZ-MhtM',
    img: '/yt-LqFxWZ-MhtM.jpg',
    date: '5 May 2026',
  },
  {
    title: "Menopause Doesn't Have to Be This Hard: Hormones, HRT & Healing",
    href: 'https://www.youtube.com/watch?v=SbfSDdyyQtg',
    img: '/yt-SbfSDdyyQtg.jpg',
    date: '29 Mar 2026',
  },
  {
    title: 'Dr. Smita Ohri on Menopause: Treatment, Misconceptions, and Being an Unstoppable Woman',
    href: 'https://www.youtube.com/watch?v=6qfcU5D18iQ',
    img: '/yt-6qfcU5D18iQ.jpg',
    date: '29 Nov 2025',
  },
  {
    title: 'Hormone Replacement Therapy: A Call for Informed Decision',
    href: 'https://www.youtube.com/watch?v=yEvF9rqyKq0',
    img: '/yt-yEvF9rqyKq0.jpg',
    date: '9 Nov 2025',
  },
  {
    title: 'From Mood Swings to Marriage Struggles: The Untold Side of Menopause',
    href: 'https://www.youtube.com/watch?v=0tN_inyZV6o',
    img: '/yt-0tN_inyZV6o.jpg',
    date: '31 Oct 2025',
  },
  {
    title: 'Menopause: Way More Than Just Hot Flashes',
    href: 'https://www.youtube.com/watch?v=Mj8I8rJJ8pQ',
    img: '/yt-Mj8I8rJJ8pQ.jpg',
    date: '25 Oct 2025',
  },
  {
    title: 'Breaking the Silence and Normalizing Menopause Conversation',
    href: 'https://www.youtube.com/watch?v=YqBrxIa-xZE',
    img: '/yt-YqBrxIa-xZE.jpg',
    date: '17 Oct 2025',
  },
];

export interface PressFeature {
  /** Publication name, e.g. 'Dainik Jagran' */
  publication: string;
  /** Article headline */
  title: string;
  /** Full URL to the article */
  href: string;
  /** Short date label shown on the card, e.g. 'Jun 2026' */
  date?: string;
  /** Thumbnail in public/, e.g. '/press-dainik-jagran.webp'. Omit for a branded text fallback. */
  img?: string;
}
// Ordered newest first; keep it that way when adding entries.
export const pressFeatures: PressFeature[] = [
  {
    publication: 'Ahmedabad Mirror',
    title: 'Swati Singh & Reshma Tiwari: Why so many women feel angry during menopause',
    href: 'https://www.ahmedabadmirror.com/swati-singh--reshma-tiwari-why-so-many-women-feel-angry-during-menopause/81916930.html',
    date: 'Jul 2026',
    img: '/press-ahmedabad-mirror.jpg',
  },
  {
    publication: 'The Hindustan Express',
    title: 'Swati Singh & Reshma Tiwari: Why so many women feel angry during menopause',
    href: 'https://thehindustanexpress.co.in/swati-singh-reshma-tiwari-why-so-many-women-feel-angry-during-menopause/',
    date: 'Jul 2026',
    img: '/press-hindustan-express.jpg',
  },
  {
    publication: 'India Global Live',
    title: "Why don't we talk about sex? Swati Singh & Reshma Tiwari on menopause, intimacy, silence & women's wellbeing",
    href: 'https://indiagloballive.co.in/why-dont-we-talk-about-sex-swati-singh-reshma-tiwari-on-menopause-intimacy-silence-womens-wellbeing/',
    date: 'Jun 2026',
    img: '/press-india-global-live.jpg',
  },
  {
    publication: 'Mid-Day',
    title: "Why don't we talk about sex? Swati Singh & Reshma Tiwari on menopause, intimacy, silence and women's wellbeing",
    href: 'https://www.mid-day.com/buzz/article/why-don-t-we-talk-about-sex-swati-singh-and-reshma-tiwari-on-menopause-intimacy-silence-and-women-s-wellbeing-10137',
    date: 'Jun 2026',
    img: '/press-mid-day.webp',
  },
  {
    publication: 'Dainik Jagran',
    title: 'ResetWell Plus founders Swati Singh and Reshma Tiwari say menopause awareness must begin with daughters, not after mothers suffer',
    href: 'https://english.dainikjagranmpcg.com/life-style/indias-resetwell-plus-founders-swati-singh-and-reshma-tiwari-say/article-20724',
    date: 'Jun 2026',
    img: '/press-dainik-jagran.webp',
  },
];
