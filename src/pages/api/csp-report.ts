// Collector for Content-Security-Policy violation reports.
//
// Without this, CSP failures are invisible: the browser blocks something and
// nobody finds out until a feature is quietly broken. Reports land in the
// Vercel function logs, which is enough to spot a bad directive or a genuine
// injection attempt.
//
// Deliberately not stored in Postgres: this endpoint is unauthenticated and
// anyone can POST to it, so writing rows would hand out free database growth.
export const prerender = false;

import type { APIRoute } from 'astro';

/** Reports larger than this are almost certainly junk. */
const MAX_BYTES = 8 * 1024;

export const POST: APIRoute = async ({ request }) => {
  try {
    const text = (await request.text()).slice(0, MAX_BYTES);
    const parsed = JSON.parse(text);
    // Browsers send either {"csp-report": {...}} (report-uri) or an array of
    // reports (Reporting API). Normalise enough to log something useful.
    const reports = Array.isArray(parsed) ? parsed : [parsed['csp-report'] ?? parsed];
    for (const r of reports) {
      const body = r?.body ?? r;
      console.warn('[csp] blocked', {
        directive: body?.['effective-directive'] ?? body?.effectiveDirective,
        blocked: body?.['blocked-uri'] ?? body?.blockedURL,
        document: body?.['document-uri'] ?? body?.documentURL,
      });
    }
  } catch {
    // A malformed report is not worth an error response.
  }
  // 204: the browser does not read the body and should not retry.
  return new Response(null, { status: 204 });
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ error: 'Method not allowed.' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
