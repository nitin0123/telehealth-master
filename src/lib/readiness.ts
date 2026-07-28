// Scoring for the corporate menopause-readiness assessment.
//
// Shared by the page (to show the result instantly) and by
// /api/corporate-readiness (which recomputes rather than trusting the browser,
// so a hand-crafted POST can't store a score that doesn't match its answers).

export type ReadinessTier = 'reactive' | 'developing' | 'leading';

/** Tier for a raw score, out of `readinessQuestions.length`. */
export function readinessTier(score: number): ReadinessTier {
  if (score <= 2) return 'reactive';
  if (score <= 4) return 'developing';
  return 'leading';
}
