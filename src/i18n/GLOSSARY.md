# Hindi translation rules

Rules for `hi.ts` and the Hindi blog posts. Follow these before adding any Hindi copy.

## Register

Write natural, spoken Hindi as Indian women in their 40s and 50s actually use, not
Sanskritised textbook Hindi. When an English word is what people genuinely say, keep it in
Devanagari transliteration rather than reaching for a formal equivalent.

The audience is women, so verbs and adjectives take feminine agreement when they refer to
the reader: "जानना चाहती हूँ", not "चाहता हूँ".

House style carries over from English: **no em-dashes**. Use commas, colons or periods.

## Terminology

| English | Hindi | Note |
|---------|-------|------|
| menopause | मेनोपॉज़ | `रजोनिवृत्ति` is correct but reads clinical. Use it once as a gloss in body copy where a reader may not know the English term, then stay with मेनोपॉज़. Keep `रजोनिवृत्ति` in meta keywords for search. |
| perimenopause | पेरिमेनोपॉज़ | No settled Hindi term in common speech. |
| HRT / hormone replacement therapy | HRT | Latin script. Gloss on first use in long copy: `HRT (हार्मोन रिप्लेसमेंट थेरेपी)`. |
| consultation | कंसल्टेशन | |
| specialist | विशेषज्ञ | |
| symptoms | लक्षण | |
| care | देखभाल | |
| community | कम्युनिटी | |
| hot flushes | हॉट फ़्लैशेज़ | |
| brain fog | ब्रेन फ़ॉग | |

## Never translate

- **Brand:** ResetWell Plus (always Latin script, never transliterated)
- **People:** founder, specialist, author and testimonial names
- **Prices and numbers:** ₹1,599 and 30 min stay as-is, in Latin digits
- **In-the-press headlines:** they are citations of real published articles
- **URLs, slugs, social handles, email addresses**
- **Form input values:** users type in English. See below.

## Forms

The chrome (labels, buttons, validation messages) is Hindi; the data entry is English.
Inputs carry `lang="en"` so they keep the Latin typeface and English autofill/spellcheck.
Placeholders that are format examples (`your@email.com`, `10-digit mobile number`) stay in
English; placeholders that are prose get Hindi plus a short `(अंग्रेज़ी में)` hint.

## SEO

Devanagari renders wider than Latin at the same character count. Keep Hindi `<title>` under
~55 characters and `<description>` under ~150 so they do not truncate in search results.
