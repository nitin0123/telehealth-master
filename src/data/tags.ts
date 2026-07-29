// Blog topic tags.
//
// A post declares its tags in frontmatter as CamelCase tokens without the `#`
// (see src/content/config.ts). Those tokens are the display form; this module
// turns them into URL slugs and back into hrefs.
//
// Tags stay in English on the Hindi edition, but a tag URL is still localised:
// /blog/tag/frozen-shoulder/ lists the English posts, and its Hindi twin
// /hindi/blog/tag/frozen-shoulder/ lists the Hindi ones. Same tag, same slug,
// each language listing its own articles.
import type { CollectionEntry } from 'astro:content';
import { localizePath, type Lang } from '../i18n';

// The indexing threshold and the slug function live in plain ESM so that
// astro.config.mjs, which is loaded before the TypeScript sources resolve, can
// import the same definitions for its sitemap filter. Re-exported here so page
// code has a single tag module to import.
export { TAG_INDEX_MIN_POSTS, isTagIndexable, tagSlug } from './tagRules.mjs';

import { tagSlug } from './tagRules.mjs';

/**
 * Hand-written introductions for the tags whose listings are indexed.
 *
 * A tag page's own words are otherwise just an H1 and a count, with everything
 * else lifted from the articles it links to. These paragraphs are what make an
 * indexed listing a page in its own right rather than a wrapper around cards.
 * Keyed by the tag's display form.
 *
 * Every tag at or above TAG_INDEX_MIN_POSTS should have an entry here. Tags
 * below the threshold may have one, and it will render, but they stay out of
 * the index either way.
 */
const TAG_INTROS: Record<string, Record<Lang, string[]>> = {
  Menopause: {
    en: [
      'Menopause is a single point in time, twelve months after your last period, but the years around it touch almost every system in the body. Indian women reach it around 46 to 47, earlier than the global average, and often with far less information than they deserve.',
      'The articles here cover that full range: what falling oestrogen does to joints, bones and the brain, why sleep breaks down and what actually repairs it, the loneliness that few women say out loud, and what it costs organisations when experienced women are left to manage all of this alone.',
      'None of it argues that menopause is something to endure quietly. Each piece explains the biology in plain language, then sets out what helps, so you can decide what to try and what to raise with a clinician.',
    ],
    hi: [
      'मेनोपॉज़ समय का एक बिंदु है, आपके आख़िरी पीरियड के बारह महीने बाद, लेकिन उसके आसपास के साल शरीर के लगभग हर तंत्र को छूते हैं। भारतीय महिलाएँ इस तक करीब 46 से 47 की उम्र में पहुँचती हैं, वैश्विक औसत से पहले, और अक्सर उतनी जानकारी के बिना जितनी उनका हक़ है।',
      'यहाँ के लेख उसी पूरे दायरे को समेटते हैं: घटता एस्ट्रोजन जोड़ों, हड्डियों और दिमाग़ के साथ क्या करता है, नींद क्यों टूटती है और उसे सचमुच क्या ठीक करता है, वह अकेलापन जिसे कम महिलाएँ खुलकर कहती हैं, और संस्थाओं को क्या क़ीमत चुकानी पड़ती है जब अनुभवी महिलाओं को यह सब अकेले सँभालने के लिए छोड़ दिया जाता है।',
      'इनमें से कोई भी लेख यह नहीं कहता कि मेनोपॉज़ चुपचाप सह लेने की चीज़ है। हर लेख जीव-विज्ञान को सरल भाषा में समझाता है, फिर बताता है कि क्या मदद करता है, ताकि आप तय कर सकें कि क्या आज़माना है और डॉक्टर से क्या पूछना है।',
    ],
  },
  Perimenopause: {
    en: [
      'Perimenopause is the stretch before menopause itself, when hormones fluctuate rather than simply decline. It often begins in the late thirties or forties, and because the symptoms arrive one at a time, they get blamed on stress, workload or ordinary ageing instead.',
      'That gap is what these articles are written for. They cover the three symptoms women report most, the brain fog that shows up in meetings, the aches that make a familiar workout feel punishing, the night sweats that break sleep, and why a tracker can insist you rested well when your body disagrees.',
      'Each one explains what is driving the symptom, what tends to help, and the signs worth taking to a doctor rather than waiting out.',
    ],
    hi: [
      'पेरिमेनोपॉज़ मेनोपॉज़ से पहले का वह दौर है, जिसमें हार्मोन सीधे घटते नहीं, बल्कि ऊपर-नीचे होते रहते हैं। यह अक्सर तीस के आख़िरी या चालीस के दशक में शुरू होता है, और चूँकि लक्षण एक-एक करके आते हैं, उन्हें तनाव, काम के बोझ या सामान्य उम्र बढ़ने पर टाल दिया जाता है।',
      'यही खाई इन लेखों की वजह है। इनमें वे तीन लक्षण हैं जो महिलाएँ सबसे ज़्यादा बताती हैं, वह ब्रेन फ़ॉग जो मीटिंग में सामने आता है, वे दर्द जो जानी-पहचानी कसरत को सज़ा जैसा बना देते हैं, रात का पसीना जो नींद तोड़ता है, और यह कि ट्रैकर क्यों कह सकता है कि आप अच्छी सोईं जबकि आपका शरीर सहमत नहीं है।',
      'हर लेख बताता है कि लक्षण के पीछे क्या है, आमतौर पर क्या मदद करता है, और कौन से संकेत इंतज़ार करने की जगह डॉक्टर तक ले जाने चाहिए।',
    ],
  },
  MenopauseAtWork: {
    en: [
      'Menopause arrives for most women in their late forties, which is precisely when many are at the height of their expertise and influence. Symptoms that go unacknowledged at work do not stay personal for long. They show up as lost confidence, declined promotions, and senior women quietly leaving.',
      'These articles look at that from both sides. For women, how to work through brain fog without feeling your competence is in question. For HR and leadership, why the conversation belongs on the agenda, what the loss of experienced talent actually costs, and the policies and culture shifts that make a measurable difference.',
      'The argument running through all of them is the same. This is a workplace design problem with known solutions, not something individual employees should be left to absorb alone.',
    ],
    hi: [
      'ज़्यादातर महिलाओं के लिए मेनोपॉज़ चालीस के आख़िरी सालों में आता है, ठीक उसी समय जब कई अपनी विशेषज्ञता और प्रभाव के शिखर पर होती हैं। काम की जगह पर जिन लक्षणों को कोई नहीं पहचानता, वे ज़्यादा दिन निजी नहीं रहते। वे घटते आत्मविश्वास, ठुकराए गए प्रमोशन, और चुपचाप नौकरी छोड़ती वरिष्ठ महिलाओं के रूप में सामने आते हैं।',
      'ये लेख इसे दोनों तरफ़ से देखते हैं। महिलाओं के लिए, ब्रेन फ़ॉग के बीच काम कैसे करें बिना यह महसूस किए कि आपकी क़ाबिलियत पर सवाल है। HR और नेतृत्व के लिए, यह चर्चा एजेंडे पर क्यों होनी चाहिए, अनुभवी प्रतिभा खोने की असली क़ीमत क्या है, और कौन सी नीतियाँ तथा सांस्कृतिक बदलाव नापा जा सकने वाला फ़र्क़ लाते हैं।',
      'इन सबमें एक ही बात चलती है। यह ज्ञात समाधानों वाली कार्यस्थल की बनावट की समस्या है, ऐसी चीज़ नहीं जिसे अकेले कर्मचारी पर छोड़ दिया जाए।',
    ],
  },
};

/** Introduction paragraphs for a tag, or null when it has none. */
export function tagIntro(tag: string, lang: Lang): string[] | null {
  return TAG_INTROS[tag]?.[lang] ?? null;
}

/** Localised URL for a tag's listing page. */
export function tagHref(tag: string, lang: Lang): string {
  return localizePath(`/blog/tag/${tagSlug(tag)}/`, lang);
}

/**
 * Every tag used by the given posts, each with its slug, the display form and
 * the posts carrying it, sorted by how many posts use it and then A to Z.
 *
 * Display form is taken from the first post that uses the tag: two posts
 * spelling one tag differently would otherwise produce two entries with the
 * same slug and collide in getStaticPaths.
 */
export function collectTags(posts: CollectionEntry<'blog'>[]) {
  const bySlug = new Map<string, { slug: string; label: string; posts: CollectionEntry<'blog'>[] }>();

  for (const post of posts) {
    for (const tag of post.data.hashtags ?? []) {
      const slug = tagSlug(tag);
      const entry = bySlug.get(slug) ?? { slug, label: tag, posts: [] };
      entry.posts.push(post);
      bySlug.set(slug, entry);
    }
  }

  return [...bySlug.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.label.localeCompare(b.label)
  );
}
