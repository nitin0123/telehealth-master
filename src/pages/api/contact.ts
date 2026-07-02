// Contact form endpoint: persists the submission to Postgres and emails it via
// Resend. Runs as a Vercel serverless function (opted out of prerendering).
export const prerender = false;

import type { APIRoute } from 'astro';
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

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

  const name = str(body.name);
  const email = str(body.email);
  const phone = str(body.phone);
  const message = str(body.message);

  if (!name || !email || !phone || !message) {
    return json({ error: 'Please fill in all fields.' }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (message.length > 5000) {
    return json({ error: 'Message is too long.' }, 400);
  }

  let ip: string | null = null;
  try { ip = clientAddress ?? null; } catch { ip = null; }

  // 1) Persist to the database (source of truth).
  try {
    await sql`
      INSERT INTO contact_messages (name, email, phone, message, ip_address)
      VALUES (${name}, ${email}, ${phone}, ${message}, ${ip})
    `;
  } catch (err) {
    console.error('[contact] DB insert failed:', err);
    return json({ error: 'Sorry, something went wrong saving your message. Please try again.' }, 500);
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
        subject: `New contact message from ${name}`,
        text: [`Name:  ${name}`, `Email: ${email}`, `Phone: ${phone}`, '', 'Message:', message].join('\n'),
      });
    } catch (err) {
      console.error('[contact] Resend email failed (message was still saved):', err);
    }
  } else {
    console.warn('[contact] RESEND_API_KEY or CONTACT_EMAIL_TO not set, skipping email.');
  }

  return json({ ok: true });
};

// Any non-POST method.
export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
