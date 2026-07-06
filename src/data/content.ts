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
  { title: 'Menopause', href: '/understand-your-symptoms/knowledge-centre', img: '/illustrations/menopause.jpeg', blurb: 'Care for the transition and beyond.' },
  { title: 'Sleep', href: '/understand-your-symptoms/knowledge-centre', img: '/illustrations/sleep.jpeg', blurb: 'Rest that actually restores you.' },
  { title: 'Mood & Memory', href: '/understand-your-symptoms/knowledge-centre', img: '/illustrations/mood-memory.jpeg', blurb: 'Steadier mood, sharper focus.' },
  { title: 'Weight', href: '/understand-your-symptoms/knowledge-centre', img: '/illustrations/weight.jpeg', blurb: 'Midlife metabolism, understood.' },
  { title: 'Hair & Skin', href: '/understand-your-symptoms/knowledge-centre', img: '/illustrations/hair-skin.jpeg', blurb: 'Hormonal changes, addressed.' },
  { title: 'Sexual Wellness', href: '/understand-your-symptoms/knowledge-centre', img: '/illustrations/sexual-wellness.jpeg', blurb: 'Intimacy and comfort, restored.' },
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
