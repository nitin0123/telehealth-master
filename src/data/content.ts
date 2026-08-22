// Structural content shared across the homepage and inner pages.
//
// Copy (titles, blurbs, quotes, FAQ text) lives in src/i18n/en.ts keyed by the
// `id`s below, so the same structure renders in either language. What stays here
// is everything that is language-independent: image paths, links, and the tag
// values used for filtering.
//
// Two datasets keep their text here on purpose:
//   - `onDemandVideos` are titles of real English-language YouTube videos
//   - `pressFeatures` are headlines of real published articles
// Translating either would mislabel the thing being linked to.

export interface CareNeed {
  /** Key into `content.careNeeds` in the i18n dictionaries */
  id: string;
  href: string;
  img: string;
}
export const careNeeds: CareNeed[] = [
  { id: 'perimenopause', href: '/understand-your-symptoms/perimenopause-101/', img: '/illustrations/perimenopause.jpeg' },
  { id: 'menopause', href: '/community/faqs/', img: '/illustrations/menopause.jpeg' },
  { id: 'sleep', href: '/community/faqs/', img: '/illustrations/sleep.jpeg' },
  { id: 'moodMemory', href: '/community/faqs/', img: '/illustrations/mood-memory.jpeg' },
  { id: 'weight', href: '/community/faqs/', img: '/illustrations/weight.jpeg' },
  { id: 'hairSkin', href: '/community/faqs/', img: '/illustrations/hair-skin.jpeg' },
  { id: 'sexualWellness', href: '/community/faqs/', img: '/illustrations/sexual-wellness.jpeg' },
  { id: 'boneHeart', href: '/get-care/how-it-works/', img: '/illustrations/bone-heart.jpeg' },
];

export interface EventItem {
  /** Key into `content.events` in the i18n dictionaries */
  id: string;
  /** Filter value used by EventsList. Language-independent on purpose. */
  tag: string;
}
// No live events scheduled right now: the upcoming-events page shows its
// "coming soon" state until an entry tagged 'Live · Online' is added here,
// e.g. { id: 'someEvent', tag: 'Live · Online' } plus its copy in src/i18n/en.ts.
export const events: EventItem[] = [
  { id: 'hrtMyths', tag: 'On Demand' },
  { id: 'strengthBones', tag: 'On Demand' },
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
    title: 'Menopause & The Workplace | Transforming Women\u2019s Health | ResetWell Plus | India HR Summit 2026',
    href: 'https://www.youtube.com/watch?v=MIbfWiIDFEQ',
    img: '/yt-MIbfWiIDFEQ.jpg',
    date: '19 Aug 2026',
  },
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

export interface ReadinessQuestion {
  /** Key into `pages.workplaceReadiness.questions` in the i18n dictionaries */
  id: string;
  /** Matching BOOLEAN column in the `corporate_readiness` table */
  column: string;
}
// The six questions behind the workplace readiness score, in the order they are
// asked. This list is the contract between three places: the page renders from
// it, the API endpoint writes each answer to the named column, and
// db/corporate_readiness.sql declares those columns. Adding a question means
// touching all three.
export const readinessQuestions: ReadinessQuestion[] = [
  { id: 'policy', column: 'q_policy' },
  { id: 'hrtCoverage', column: 'q_hrt_coverage' },
  { id: 'attritionTracked', column: 'q_attrition_tracked' },
  { id: 'managerTraining', column: 'q_manager_training' },
  { id: 'flexibility', column: 'q_flexibility' },
  { id: 'leadershipVoice', column: 'q_leadership_voice' },
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
    publication: 'The Times of India',
    title: "Menopause may be India's most overlooked marriage challenge, say wellness advocates Swati Singh and Reshma Tiwari",
    href: 'https://timesofindia.indiatimes.com/life-style/spotlight/menopause-may-be-indias-most-overlooked-marriage-challenge-say-resetwell-plus-swati-singh-and-reshma-tiwari/articleshow/133321024.cms',
    date: 'Aug 2026',
    img: '/press-times-of-india.jpg',
  },
  {
    publication: 'Republic World',
    title: "ResetWell Plus founders Swati Singh and Reshma Tiwari spark public debate on menopause and women's wellbeing",
    href: 'https://www.republicworld.com/initiatives/resetwell-plus-founders-swati-singh-and-reshma-tiwari-spark-public-debate-on-menopause-and-women-s-wellbeing-2026-08-08-134314',
    date: 'Aug 2026',
    img: '/press-republic-world.jpg',
  },
  {
    publication: 'Press Trust of India',
    title: "ResetWell Plus founders Swati Singh and Reshma Tiwari: Menopause may be India's most overlooked marriage challenge",
    href: 'https://www.ptinews.com/press-release/resetwell-plus-founders-swati-singh-and-reshma-tiwari-menopause-may-be-india-s-most-overlooked-marriage-challenge/3918615',
    date: 'Jul 2026',
  },
  {
    publication: 'The Wire',
    title: "ResetWell Plus founders Swati Singh and Reshma Tiwari: Menopause may be India's most overlooked marriage challenge",
    href: 'https://thewire.in/ptiprnews/resetwell-plus-founders-swati-singh-and-reshma-tiwari-menopause-may-be-indias-most-overlooked-marriage-challenge',
    date: 'Jul 2026',
  },
  {
    publication: 'Press Trust of India',
    title: 'Platform launches initiative to boost menopause awareness, workplace support',
    href: 'https://www.ptinews.com/story/NATIONAL/platform-launches-initiative-to-boost-menopause-awareness-workplace-support/3828389',
    date: 'Jul 2026',
  },
  {
    publication: 'News18',
    title: 'Platform launches initiative to boost menopause awareness, workplace support',
    href: 'https://www.news18.com/agency-feeds/platform-launches-initiative-to-boost-menopause-awareness-workplace-support-10190132.html',
    date: 'Jul 2026',
  },
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
