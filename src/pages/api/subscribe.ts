// Mailing-list signup endpoint: persists the email to Postgres and emails a
// notification via Resend. Backs both the community "Join the Community" form
// and the coming-soon "Notify me" form. Runs as a Vercel serverless function.
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { Resend } from 'resend';
import { subscribeSchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';
import { readBody, redirect } from '../../lib/formBody';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const SOURCES: Record<string, string> = {
  'community-join': 'Community — Join the Community',
  'coming-soon': 'Coming soon — Notify me',
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const back = '/community/join/';
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
  if (await rateLimited(ip, 'subscribe')) {
    return fail('Too many submissions from your network. Please try again in a few minutes.', 429);
  }

  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) {
    return fail(firstError(parsed.error), 400);
  }
  const email = parsed.data.email;
  const source = parsed.data.source ?? 'unknown';

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
    return fail('Sorry, something went wrong. Please try again.', 500);
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

  if (isFormPost) return redirect('/thank-you/');
  return json({ ok: true });
};

// Any non-POST method.
export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
