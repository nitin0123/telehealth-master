// Hindi daily quotes, shown by the DailyQuote component on /hindi pages.
//
// Must stay the SAME LENGTH and ORDER as the English list in quotes.ts: the
// component picks by days-since-epoch (IST), so index N has to mean the same
// day's quote in both languages.
//
// Empty until the translation pass; DailyQuote falls back to the English list
// while this is empty, so the Hindi page always has a quote to show.
export const quotes: string[] = [];
