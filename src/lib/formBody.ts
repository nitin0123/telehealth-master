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
 * Where to send a browser that posted the form directly. `to` is the success
 * page; on failure the visitor goes back to the form they came from.
 */
export function redirect(to: string): Response {
  return new Response(null, { status: 303, headers: { Location: to } });
}
