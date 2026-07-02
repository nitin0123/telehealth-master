// Shared content used across the homepage and inner pages.
// Edit here to update copy site-wide. Replace with a CMS/API later if desired.

export const stats = [
  { value: '30 min', label: 'unhurried specialist visit' },
  { value: '₹1,499', label: 'flat consultation fee' },
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
  { title: 'Sexual Wellness', href: '/understand-your-symptoms/knowledge-centre', img: '/illustrations/sexual-wellness.jpeg', blurb: 'Intimacy and comfort, restored.' },
  { title: 'Hair & Skin', href: '/understand-your-symptoms/knowledge-centre', img: '/illustrations/hair-skin.jpeg', blurb: 'Hormonal changes, addressed.' },
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
  { q: 'Online or in person?', a: 'Visits are virtual by default, with in-clinic options in select cities.' },
  { q: 'What does it cost?', a: 'Consultations start at ₹1,499. See the Pricing page for full details.' },
];

export interface EventItem {
  title: string;
  meta: string;
  tag: string;
}
export const events: EventItem[] = [
  { title: 'Perimenopause & Sleep', meta: 'Tue, 8 Jul · 7:00 PM IST · Live online', tag: 'Live · Online' },
  { title: 'HRT: Myths vs Facts', meta: 'On demand · 48 min', tag: 'On Demand' },
  { title: 'Nutrition in Midlife', meta: 'Thu, 17 Jul · 6:30 PM IST', tag: 'Live · Online' },
  { title: 'Strength & Bones', meta: 'On demand · 35 min', tag: 'On Demand' },
];
