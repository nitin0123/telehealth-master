// Dependency-free validation for the form <script> blocks.
//
// The API routes remain the source of truth and still validate with zod (see
// ./schemas.ts). This exists only so the browser can give instant feedback
// without pulling zod into the page bundle, which cost ~56 KB on every page
// carrying a form. Messages are kept identical to the zod ones so a field
// rejected here reads the same as one rejected by the server.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Check = () => string | null;

/** Returns the first failure message, or null when everything passes. */
function first(...checks: Check[]): string | null {
  for (const check of checks) {
    const message = check();
    if (message) return message;
  }
  return null;
}

const required = (value: string, message: string): Check => () => (value.trim() ? null : message);
const maxLen = (value: string, max: number, message: string): Check => () =>
  value.trim().length <= max ? null : message;
const email = (value: string): Check => () => {
  const v = value.trim();
  if (!v) return 'Please enter your email address.';
  if (!EMAIL.test(v)) return 'Please enter a valid email address.';
  if (v.length > 320) return 'That email address is too long.';
  return null;
};

export function validateContact(d: { name: string; email: string; phone: string; message: string }) {
  return first(
    required(d.name, 'Please enter your name.'),
    maxLen(d.name, 200, 'That name is too long.'),
    email(d.email),
    required(d.phone, 'Please enter your phone number.'),
    maxLen(d.phone, 50, 'That phone number is too long.'),
    required(d.message, 'Please enter a message.'),
    maxLen(d.message, 5000, 'Message is too long.')
  );
}

export function validateSubscribe(d: { email: string }) {
  return first(email(d.email));
}

export function validateSmsConsent(d: {
  phoneNumber: string;
  consentMarketing?: boolean;
  consentInformational?: boolean;
}) {
  return first(
    required(d.phoneNumber, 'Please enter a phone number.'),
    maxLen(d.phoneNumber, 30, 'That phone number is too long.'),
    () => (d.consentMarketing || d.consentInformational ? null : 'Please opt in to at least one type of messaging.')
  );
}

export function validateCorporateLead(d: { name: string; company: string; email: string }) {
  return first(
    required(d.name, 'Please enter your name.'),
    maxLen(d.name, 200, 'That name is too long.'),
    required(d.company, 'Please enter your company name.'),
    maxLen(d.company, 200, 'That company name is too long.'),
    email(d.email)
  );
}

export function validateCorporateReadiness(
  d: { name: string; company: string; email: string; answers: boolean[] },
  expectedAnswers: number
) {
  return first(
    () => validateCorporateLead(d),
    () =>
      d.answers.length === expectedAnswers && d.answers.every((a) => typeof a === 'boolean')
        ? null
        : 'Please answer every question.'
  );
}
