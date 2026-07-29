// Gated corporate resource endpoint: persists the lead to Postgres, emails the
// requested PDF, and notifies the team. Runs as a Vercel serverless function.
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { Resend } from 'resend';
import { corporateLeadSchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';
import { readBody, redirect } from '../../lib/formBody';
import { LOGO_CID } from '../../lib/emails/readinessReport';
import { corporateResourceHtml, corporateResourceText } from '../../lib/emails/corporateResource';
import { SITE } from '../../data/seo';
// Inlined at build time (see `base64Asset` in astro.config.mjs) so neither the
// attachment nor the logo depends on the deployment being publicly fetchable.
// Deliberately NOT in public/: the one-pager is gated behind this form, and
// anything under public/ is served as a static file at a guessable URL.
import onePagerBase64 from '../../assets/reports/resetwellplus-corporate-wellness-one-pager.pdf?base64';
import logoBase64 from '../../../public/logo.png?base64';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/**
 * Downloadable resources, keyed by the `resource` value the form posts.
 * Swap the file at src/assets/reports/ to change what gets sent; the import above
 * picks it up at build time.
 */
const RESOURCES = {
  'one-pager': {
    label: 'Corporate Wellness one-pager',
    filename: 'ResetWell Plus - Corporate Wellness One-Pager.pdf',
    content: onePagerBase64,
  },
} as const;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const back = '/about/workplace-wellness/corporate-one-pager/';
  const parsedBody = await readBody(request);
  if (!parsedBody) return json({ error: 'Invalid request body.' }, 400);
  const { data: body, isFormPost } = parsedBody;
  // A browser that posted the <form> itself cannot read a JSON reply, so every
  // exit below has to become a redirect for it.
  const fail = (message: string, status: number) =>
    isFormPost ? redirect(back) : json({ error: message }, status);

  // Honeypot: "website", not "company" (a real field on this form).
  if (str(body.website)) return isFormPost ? redirect('/thank-you/') : json({ ok: true });

  let ip: string | null = null;
  try { ip = clientAddress ?? null; } catch { ip = null; }
  if (await rateLimited(ip, 'corporate-lead')) {
    return fail('Too many submissions from your network. Please try again in a few minutes.', 429);
  }

  const parsed = corporateLeadSchema.safeParse(body);
  if (!parsed.success) {
    return fail(firstError(parsed.error), 400);
  }
  const { name, company, email, resource } = parsed.data;
  const source = parsed.data.source ?? 'workplace-wellness';
  const doc = RESOURCES[resource];

  // 1) Persist to the database (source of truth). One row per email+resource:
  // re-requesting the same document refreshes the row instead of adding one.
  // `xmax = 0` is true only for a genuine INSERT.
  let isFirstRequest = true;
  try {
    const result = await db().query(
      `INSERT INTO corporate_leads (name, company, work_email, resource, source, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (work_email, resource) DO UPDATE
         SET name = EXCLUDED.name, company = EXCLUDED.company,
             source = EXCLUDED.source, ip_address = EXCLUDED.ip_address, updated_at = now()
       RETURNING (xmax = 0) AS is_new`,
      [name, company, email, resource, source, ip]
    );
    isFirstRequest = result.rows[0]?.is_new === true;
  } catch (err) {
    console.error('[corporate-lead] DB insert failed:', err);
    return fail('Sorry, something went wrong saving your details. Please try again.', 500);
  }

  // 2) Emails, both best-effort: the lead is already saved either way.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM || 'ResetWell Plus <onboarding@resend.dev>';

  if (apiKey) {
    const resend = new Resend(apiKey);
    const emailInput = {
      name,
      company,
      resourceLabel: doc.label,
      contactUrl: new URL('/contact/', SITE.url).href,
      readinessUrl: new URL('/about/workplace-wellness/readiness-score/', SITE.url).href,
    };

    // Sent once per address per document, so nobody gets the same PDF twice.
    if (isFirstRequest) {
      try {
        await resend.emails.send({
          from,
          to: email,
          ...(to ? { replyTo: to } : {}),
          subject: `Your ${doc.label} from ResetWell Plus`,
          html: corporateResourceHtml(emailInput),
          text: corporateResourceText(emailInput),
          // Base64 strings, not Buffers: the SDK puts `content` through
          // JSON.stringify, which mangles a Buffer into {"type":"Buffer",...}.
          attachments: [
            { filename: doc.filename, content: doc.content },
            { filename: 'resetwell-plus-logo.png', content: logoBase64, contentType: 'image/png', contentId: LOGO_CID },
          ],
        });
      } catch (err) {
        console.error('[corporate-lead] Resource email failed (lead was still saved):', err);
      }
    }

    if (to) {
      try {
        await resend.emails.send({
          from,
          to,
          replyTo: email,
          subject: `${isFirstRequest ? 'Resource request' : 'Repeat request'}: ${company} wants the ${doc.label}`,
          text: [
            `Name:     ${name}`,
            `Company:  ${company}`,
            `Email:    ${email}`,
            `Resource: ${doc.label}`,
            `Source:   ${source}`,
            isFirstRequest
              ? 'Sent:     yes'
              : 'Sent:     no, this address already received it',
          ].join('\n'),
        });
      } catch (err) {
        console.error('[corporate-lead] Internal notification failed (lead was still saved):', err);
      }
    }
  } else {
    console.warn('[corporate-lead] RESEND_API_KEY not set, skipping emails.');
  }

  if (isFormPost) return redirect('/thank-you/');
  return json({ ok: true, sent: isFirstRequest });
};

// Any non-POST method.
export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
