// Mailing-list signup endpoint: persists the email to Postgres and emails a
// notification via Resend. Backs both the community "Join the Community" form
// and the coming-soon "Notify me" form. Runs as a Vercel serverless function.
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { Resend } from 'resend';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const SOURCES: Record<string, string> = {
  'community-join': 'Community — Join the Community',
  'coming-soon': 'Coming soon — Notify me',
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Honeypot: real users never fill this hidden field; bots do. Pretend success.
  if (str(body.company)) return json({ ok: true });

  const email = str(body.email).toLowerCase();
  const source = SOURCES[str(body.source)] ? str(body.source) : 'unknown';

  if (!email) {
    return json({ error: 'Please enter your email address.' }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (email.length > 320) {
    return json({ error: 'That email address is too long.' }, 400);
  }

  let ip: string | null = null;
  try { ip = clientAddress ?? null; } catch { ip = null; }

  // 1) Persist to the database (source of truth). Re-signups are idempotent.
  try {
    await db().sql`
      INSERT INTO subscribers (email, source, ip_address)
      VALUES (${email}, ${source}, ${ip})
      ON CONFLICT (email) DO UPDATE
        SET source = EXCLUDED.source, updated_at = now()
    `;
  } catch (err) {
    console.error('[subscribe] DB insert failed:', err);
    return json({ error: 'Sorry, something went wrong. Please try again.' }, 500);
  }

  // 2) Email a notification (best-effort; the subscriber is already saved).
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM || 'ResetWell Plus <onboarding@resend.dev>';
  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey);
      const label = SOURCES[source] ?? source;
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        subject: `New subscriber: ${email}`,
        text: [`Email:  ${email}`, `Source: ${label}`].join('\n'),
      });
    } catch (err) {
      console.error('[subscribe] Resend email failed (subscriber was still saved):', err);
    }
  } else {
    console.warn('[subscribe] RESEND_API_KEY or CONTACT_EMAIL_TO not set, skipping email.');
  }

  return json({ ok: true });
};

// Any non-POST method.
export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
