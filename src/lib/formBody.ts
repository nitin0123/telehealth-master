// Read a request body that may arrive as JSON (the enhanced path, sent by the
// page's fetch call) or as an ordinary form POST (the fallback, when the
// browser submits the <form> itself because JavaScript did not run).
//
// Without this the forms fail silently with JS disabled or a bundle that never
// loaded: the submit button does nothing at all.

export interface ParsedBody {
  data: Record<string, unknown>;
  /** True when the browser posted the form directly, so it expects a redirect. */
  isFormPost: boolean;
}

/** Checkbox-style fields that arrive as "on"/absent rather than true/false. */
const BOOLEAN_FIELDS = new Set(['consentMarketing', 'consentInformational']);

export async function readBody(request: Request): Promise<ParsedBody | null> {
  const type = request.headers.get('content-type') ?? '';

  if (type.includes('application/json')) {
    try {
      return { data: (await request.json()) as Record<string, unknown>, isFormPost: false };
    } catch {
      return null;
    }
  }

  if (type.includes('form-urlencoded') || type.includes('multipart/form-data')) {
    try {
      const form = await request.formData();
      const data: Record<string, unknown> = {};
      for (const [key, value] of form.entries()) {
        data[key] = BOOLEAN_FIELDS.has(key) ? true : typeof value === 'string' ? value : '';
      }
      // Unchecked boxes are simply absent from a form post.
      for (const key of BOOLEAN_FIELDS) if (!(key in data)) data[key] = false;
      return { data, isFormPost: true };
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Language the form was submitted in, from the hidden `lang` field every
 * localised form carries.
 *
 * The no-JS path is the only one that redirects, and a redirect has to name a
 * concrete URL, so the endpoint has to be told which language edition the
 * visitor is on. A hidden field is used rather than the Referer header because
 * Referrer-Policy is configurable and a stripped header would silently drop
 * Hindi visitors back onto English pages, which is the bug this prevents.
 *
 * Anything other than 'hi' is treated as English, so a missing field on an
 * English-only form (the corporate pages) behaves correctly by default.
 */
export function langOf(data: Record<string, unknown>): 'en' | 'hi' {
  return data.lang === 'hi' ? 'hi' : 'en';
}

/**
 * Localise a site path for the language a form was submitted in. Mirrors
 * localizePath() in src/i18n, kept separate so the serverless bundles do not
 * pull in both translation dictionaries just to prepend a prefix.
 */
export function localised(path: string, lang: 'en' | 'hi'): string {
  return lang === 'hi' ? `/hindi${path}` : path;
}

/**
 * Where to send a browser that posted the form directly. `to` is the success
 * page; on failure the visitor goes back to the form they came from.
 */
export function redirect(to: string): Response {
  return new Response(null, { status: 303, headers: { Location: to } });
}
