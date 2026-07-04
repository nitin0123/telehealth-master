// SMS consent endpoint: records each opt-in in the sms_consent table as
// documented proof of consent. Runs as a Vercel serverless function.
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { smsConsentSchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Honeypot: real users never fill this hidden field; bots do. Pretend success.
  if (str(body.company)) return json({ ok: true });

  let ip: string | null = null;
  try { ip = clientAddress ?? null; } catch { ip = null; }
  if (rateLimited(ip)) {
    return json({ error: 'Too many submissions from your network. Please try again in a few minutes.' }, 429);
  }

  const parsed = smsConsentSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: firstError(parsed.error) }, 400);
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
    return json({ error: 'Sorry, we couldn\'t record your consent. Please try again.' }, 500);
  }

  return json({ ok: true });
};

export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
