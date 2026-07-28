// Hindi copy. Mirrors the key structure of `en.ts`; anything omitted here falls
// back to the English string, so translations can land area by area.
//
// Register: natural, spoken Hindi as Indian women actually use it, not
// Sanskritised textbook Hindi. Widely-used English medical terms stay in
// Devanagari transliteration (मेनोपॉज़, पेरिमेनोपॉज़) rather than being forced
// into रजोनिवृत्ति. Brand names, people's names, prices and URLs are never
// translated. See GLOSSARY.md. House style: no em-dashes.
import type { DeepPartial, Dict } from './types';

export const hi: DeepPartial<Dict> = {
  seo: {
    defaultTitle: 'ResetWell Plus: भारत में ऑनलाइन मेनोपॉज़ और पेरिमेनोपॉज़ केयर',
    defaultDescription:
      'ResetWell Plus भारत का विशेषज्ञों द्वारा संचालित पेरिमेनोपॉज़ और मेनोपॉज़ प्लेटफ़ॉर्म है। ऑनलाइन मेनोपॉज़ विशेषज्ञ से सलाह लें, अपने लक्षण जाँचें और अपने लिए बनी इलाज योजना पाएँ।',
    ogImageAlt: 'ResetWell Plus: भारत की विशेषज्ञ मेनोपॉज़ और पेरिमेनोपॉज़ केयर',
    homeKeywords:
      'मेनोपॉज़ इलाज भारत, पेरिमेनोपॉज़ लक्षण, ऑनलाइन गायनेकोलॉजिस्ट परामर्श, मेनोपॉज़ विशेषज्ञ भारत, HRT भारत, रजोनिवृत्ति इलाज',
  },

  nav: {
    sections: {
      symptoms: { label: 'अपने लक्षण समझें', short: 'लक्षण समझें' },
      care: { label: 'देखभाल पाएँ' },
      events: { label: 'इवेंट्स' },
      community: { label: 'कम्युनिटी' },
      blog: { label: 'ब्लॉग' },
      about: { label: 'हमारे बारे में' },
    },
    links: {
      perimenopause101: { label: 'पेरिमेनोपॉज़ 101', blurb: 'यहाँ से शुरू करें: बुनियादी बातें' },
      symptomChecker: { label: 'लक्षण जाँच', blurb: '2 मिनट का स्व-आकलन' },
      howItWorks: { label: 'यह कैसे काम करता है' },
      ourSpecialists: { label: 'हमारे विशेषज्ञ' },
      bookConsultation: { label: 'कंसल्टेशन बुक करें' },
      pricing: { label: 'शुल्क (₹)', short: 'शुल्क' },
      eventsUpcoming: { label: 'आगामी' },
      eventsOnDemand: { label: 'ऑन डिमांड' },
      eventsForCorporates: { label: 'कॉर्पोरेट्स के लिए' },
      communityJoin: { label: 'जुड़ें' },
      storiesOfReset: { label: 'रीसेट की कहानियाँ' },
      faqs: { label: 'अक्सर पूछे सवाल' },
      founders: { label: 'संस्थापकों से मिलें' },
      ourStory: { label: 'हमारी कहानी' },
      ourTeam: { label: 'हमारी टीम' },
      inThePress: { label: 'मीडिया में' },
      workplaceWellness: { label: 'वर्कप्लेस वेलनेस' },
    },
    home: 'होम',
    theBook: 'किताब',
    contact: 'संपर्क करें',
    bookCta: 'कंसल्टेशन बुक करें',
    brandHome: '{brand} होम',
    openMenu: 'मेन्यू खोलें',
    closeMenu: 'मेन्यू बंद करें',
    viewInHindi: 'इस पेज को हिंदी में देखें',
    viewInEnglish: 'इस पेज को अंग्रेज़ी में देखें',
  },

  footer: {
    cols: {
      symptoms: 'लक्षण',
      care: 'देखभाल',
      community: 'कम्युनिटी',
      about: 'हमारे बारे में',
    },
    contact: 'संपर्क करें',
    privacy: 'प्राइवेसी पॉलिसी',
    terms: 'उपयोग की शर्तें',
    disclaimer: 'मेडिकल डिस्क्लेमर',
    cookiePrefs: 'कुकी सेटिंग्स',
  },

  common: {
    whatsappLabel: 'व्हाट्सऐप',
    whatsappAria: 'व्हाट्सऐप पर हमसे बात करें',
    whatsappPrefill: 'नमस्ते, मैं ResetWell Plus के बारे में और जानना चाहती हूँ।',
  },
};
