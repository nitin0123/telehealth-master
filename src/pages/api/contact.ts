// Contact form endpoint: persists the submission to Postgres and emails it via
// Resend. Runs as a Vercel serverless function (opted out of prerendering).
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { Resend } from 'resend';
import { contactSchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';
import { readBody, redirect } from '../../lib/formBody';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const back = '/contact/';
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
  if (rateLimited(ip)) {
    return fail('Too many messages from your network. Please try again in a few minutes.', 429);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return fail(firstError(parsed.error), 400);
  }
  const { name, email, phone, message } = parsed.data;

  // 1) Persist to the database (source of truth).
  try {
    await db().sql`
      INSERT INTO contact_messages (name, email, phone, message, ip_address)
      VALUES (${name}, ${email}, ${phone}, ${message}, ${ip})
    `;
  } catch (err) {
    console.error('[contact] DB insert failed:', err);
    return fail('Sorry, something went wrong saving your message. Please try again.', 500);
  }

  // 2) Email a notification (best-effort; the message is already saved).
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM || 'ResetWell Plus <onboarding@resend.dev>';
  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from,
        to,
        replyTo: email,
        // Collapse any embedded line breaks: the subject must stay a single line.
        subject: `New contact message from ${name.replace(/[\r\n]+/g, ' ')}`,
        text: [`Name:  ${name}`, `Email: ${email}`, `Phone: ${phone}`, '', 'Message:', message].join('\n'),
      });
    } catch (err) {
      console.error('[contact] Resend email failed (message was still saved):', err);
    }
  } else {
    console.warn('[contact] RESEND_API_KEY or CONTACT_EMAIL_TO not set, skipping email.');
  }

  if (isFormPost) return redirect('/thank-you/');
  return json({ ok: true });
};

// Any non-POST method.
export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
