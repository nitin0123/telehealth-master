// Corporate readiness assessment endpoint: persists the submission to Postgres,
// emails the lead the benchmark report PDF, and sends an internal notification.
// Runs as a Vercel serverless function (opted out of prerendering).
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { Resend } from 'resend';
import { corporateReadinessSchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';
import { readinessTier } from '../../lib/readiness';
import { readinessQuestions } from '../../data/content';
import { en } from '../../i18n/en';
import { SITE } from '../../data/seo';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const copy = en.pages.workplaceReadiness;

// The lead magnet. Swap this file in public/ to change what gets sent; the
// filename the recipient sees is set separately below.
const REPORT_PATH = '/reports/resetwellplus-state-of-menopause-report.pdf';
const REPORT_FILENAME = 'ResetWell Plus - State of Menopause Report.pdf';

export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  // Honeypot: "website", not the usual "company" (which is a real field on this
  // form). Real users never fill it; bots do. Pretend success.
  if (str(body.website)) return json({ ok: true });

  let ip: string | null = null;
  try { ip = clientAddress ?? null; } catch { ip = null; }
  if (rateLimited(ip)) {
    return json({ error: 'Too many submissions from your network. Please try again in a few minutes.' }, 429);
  }

  const parsed = corporateReadinessSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: firstError(parsed.error) }, 400);
  }
  const { name, company, email, answers } = parsed.data;
  const source = parsed.data.source ?? 'website';

  // Derived server-side: a hand-crafted POST can't store a score that disagrees
  // with its own answers.
  const score = answers.filter(Boolean).length;
  const tier = readinessTier(score);
  const tierLabel = copy.tiers[tier].label;

  // 1) Persist to the database (source of truth). The column list is built from
  // `readinessQuestions` so the six answers always land in the right columns.
  try {
    const columns = [
      'name', 'company', 'work_email', 'score', 'tier',
      ...readinessQuestions.map((q) => q.column),
      'source', 'ip_address',
    ];
    const values = [name, company, email, score, tier, ...answers, source, ip];
    // Placeholders are generated from the column list, so adding a question to
    // `readinessQuestions` (plus its column) needs no change here.
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    await db().query(
      `INSERT INTO corporate_readiness (${columns.join(', ')}) VALUES (${placeholders})`,
      values
    );
  } catch (err) {
    console.error('[corporate-readiness] DB insert failed:', err);
    return json({ error: 'Sorry, something went wrong saving your answers. Please try again.' }, 500);
  }

  // 2) Email the report to the lead, and a notification to the team. Both are
  // best-effort: the submission is already saved either way.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM || 'ResetWell Plus <onboarding@resend.dev>';

  // Answers spelled out, used in both the notification and the lead's email.
  const answerLines = readinessQuestions.map((q, i) => {
    const label = answers[i] ? copy.inPlace : copy.gap;
    return `${label.toUpperCase().padEnd(8)} ${copy.questions[q.id].text}`;
  });

  if (apiKey) {
    const resend = new Resend(apiKey);
    // Absolute URL so Resend can fetch the attachment. Uses the request origin
    // in preview deploys and the canonical site URL in production.
    const reportUrl = new URL(REPORT_PATH, url.origin || SITE.url).href;

    try {
      await resend.emails.send({
        from,
        to: email,
        ...(to ? { replyTo: to } : {}),
        subject: `Your menopause workplace readiness score: ${score}/${readinessQuestions.length} (${tierLabel})`,
        text: [
          `Hi ${name.split(' ')[0]},`,
          '',
          `Here is where ${company} landed on the ResetWell Plus menopause workplace readiness assessment.`,
          '',
          `Score: ${score} out of ${readinessQuestions.length}`,
          `Tier:  ${tierLabel}`,
          '',
          copy.tiers[tier].copy,
          '',
          'Your answers:',
          ...answerLines,
          '',
          'The full State of Menopause report is attached.',
          '',
          'If you would like to talk through what a pilot looks like for your teams, just reply to this email.',
          '',
          'ResetWell Plus',
          SITE.url,
        ].join('\n'),
        attachments: [{ filename: REPORT_FILENAME, path: reportUrl }],
      });
    } catch (err) {
      console.error('[corporate-readiness] Report email to lead failed (answers were still saved):', err);
    }

    if (to) {
      try {
        await resend.emails.send({
          from,
          to,
          replyTo: email,
          subject: `Readiness assessment: ${company} scored ${score}/${readinessQuestions.length} (${tierLabel})`,
          text: [
            `Name:    ${name}`,
            `Company: ${company}`,
            `Email:   ${email}`,
            `Score:   ${score}/${readinessQuestions.length} (${tierLabel})`,
            `Source:  ${source}`,
            '',
            'Answers:',
            ...answerLines,
          ].join('\n'),
        });
      } catch (err) {
        console.error('[corporate-readiness] Internal notification failed (answers were still saved):', err);
      }
    }
  } else {
    console.warn('[corporate-readiness] RESEND_API_KEY not set, skipping emails.');
  }

  return json({ ok: true });
};

// Any non-POST method.
export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
