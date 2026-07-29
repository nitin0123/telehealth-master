// SMS consent endpoint: records each opt-in in the sms_consent table as
// documented proof of consent. Runs as a Vercel serverless function.
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { smsConsentSchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';
import { readBody, redirect } from '../../lib/formBody';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const back = '/sms-consent/';
  const parsedBody = await readBody(request);
  if (!parsedBody) return json({ error: 'Invalid request body.' }, 400);
  const { data: body, isFormPost } = parsedBody;
  // A browser that posted the <form> itself cannot read a JSON reply, so every
  // exit below has to become a redirect for it.
  const fail = (message: string, status: number) =>
    isFormPost ? redirect(back) : json({ error: message }, status);

  // Honeypot: real users never fill this hidden field; bots do. Pretend success.
  if (str(body.company)) return isFormPost ? redirect('/thank-you/') : json({ ok: true });

  let ip: string | null = null;
  try { ip = clientAddress ?? null; } catch { ip = null; }
  if (await rateLimited(ip, 'sms-consent')) {
    return fail('Too many submissions from your network. Please try again in a few minutes.', 429);
  }

  const parsed = smsConsentSchema.safeParse(body);
  if (!parsed.success) {
    return fail(firstError(parsed.error), 400);
  }
  const { phoneNumber: phone, consentMarketing: marketing, consentInformational: informational } = parsed.data;
  const userAgent = request.headers.get('user-agent');

  try {
    await db().sql`
      INSERT INTO sms_consent (phone_number, consent_marketing, consent_informational, ip_address, user_agent)
      VALUES (${phone}, ${marketing}, ${informational}, ${ip}, ${userAgent})
    `;
  } catch (err) {
    console.error('[sms-consent] DB insert failed:', err);
    return fail('Sorry, we couldn\'t record your consent. Please try again.', 500);
  }

  if (isFormPost) return redirect('/thank-you/');
  return json({ ok: true });
};

export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
