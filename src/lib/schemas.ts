// Shared request validation for the site's form endpoints.
//
// Imported by BOTH the API routes (server, the source of truth) and the form
// <script> blocks (client, for instant inline feedback), so the rules and error
// messages live in one place and stay in sync on both sides.
//
// Note: the honeypot ("company") field is intentionally NOT modelled here — the
// endpoints handle it separately by returning a fake success, so bots aren't
// tipped off by a validation error.
import { z } from 'zod';
import { readinessQuestions } from '../data/content';

const readinessQuestionCount = readinessQuestions.length;

const email = z
  .string({ required_error: 'Please enter your email address.' })
  .trim()
  .toLowerCase()
  .min(1, 'Please enter your email address.')
  .email('Please enter a valid email address.')
  .max(320, 'That email address is too long.');

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(200, 'That name is too long.'),
  email,
  phone: z.string().trim().min(1, 'Please enter your phone number.').max(50, 'That phone number is too long.'),
  message: z.string().trim().min(1, 'Please enter a message.').max(5000, 'Message is too long.'),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const subscribeSchema = z.object({
  email,
  source: z.enum(['community-join', 'coming-soon']).optional(),
});
export type SubscribeInput = z.infer<typeof subscribeSchema>;

// Corporate readiness assessment (/about/workplace-wellness/readiness-score/).
//
// Note the honeypot here is "website", NOT "company": this form asks for the
// company as a real, required field, so reusing the site's usual `company`
// honeypot would silently discard every genuine submission.
export const corporateReadinessSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(200, 'That name is too long.'),
  company: z.string().trim().min(1, 'Please enter your company name.').max(200, 'That company name is too long.'),
  email,
  // One yes/no per question, in the order given by `readinessQuestions`. The
  // score and tier are derived from this server-side, never taken from input.
  answers: z
    .array(z.boolean(), { required_error: 'Please answer every question.' })
    .length(readinessQuestionCount, 'Please answer every question.'),
  source: z.string().trim().max(60).optional(),
});
export type CorporateReadinessInput = z.infer<typeof corporateReadinessSchema>;

// Gated corporate resource download (/about/workplace-wellness/…).
// Same honeypot note as above: "website", not "company".
export const corporateLeadSchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(200, 'That name is too long.'),
  company: z.string().trim().min(1, 'Please enter your company name.').max(200, 'That company name is too long.'),
  email,
  resource: z.enum(['one-pager']).default('one-pager'),
  source: z.string().trim().max(60).optional(),
});
export type CorporateLeadInput = z.infer<typeof corporateLeadSchema>;

export const smsConsentSchema = z
  .object({
    phoneNumber: z.string().trim().min(1, 'Please enter a phone number.').max(30, 'That phone number is too long.'),
    consentMarketing: z.boolean().optional().default(false),
    consentInformational: z.boolean().optional().default(false),
  })
  .refine((d) => d.consentMarketing || d.consentInformational, {
    message: 'Please opt in to at least one type of messaging.',
    path: ['consentInformational'],
  });
export type SmsConsentInput = z.infer<typeof smsConsentSchema>;

/** First human-readable message from a failed safeParse, for showing to users. */
export function firstError(err: z.ZodError): string {
  return err.issues[0]?.message ?? 'Please check the form and try again.';
}

// Poll identity capture (/poll/<id>/).
//
// The honeypot here is "website", NOT "company": the poll asks for the company
// as a real, required field, exactly as the corporate forms do.
/**
 * Indian mobile number, entered as 10 digits behind a fixed +91 prefix.
 *
 * Forgiving on input, strict on output: a pasted '+91 98765 43210',
 * '098765 43210' or '9876543210' all normalise to the same +919876543210, so
 * one person is never stored as two respondents because of formatting.
 * Deliberately does not require a 6-9 first digit; the cost of turning away a
 * real respondent is higher than the cost of accepting an odd number.
 */
const indianPhone = z
  .string({ required_error: 'Please enter your phone number.' })
  .trim()
  .transform((v) => {
    const digits = v.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits;
  })
  .refine((d) => d.length === 10, 'Please enter a 10 digit mobile number.')
  .transform((d) => `+91${d}`);

export const pollIdentifySchema = z.object({
  name: z.string().trim().min(1, 'Please enter your name.').max(200, 'That name is too long.'),
  company: z.string().trim().min(1, 'Please enter your company name.').max(200, 'That company name is too long.'),
  phone: indianPhone,
});
export type PollIdentifyInput = z.infer<typeof pollIdentifySchema>;

export const pollVoteSchema = z.object({
  poll: z.string().trim().min(1).max(100),
  option: z.string().trim().min(1).max(100),
});
export type PollVoteInput = z.infer<typeof pollVoteSchema>;
