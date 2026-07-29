// Corporate readiness assessment endpoint: persists the submission to Postgres,
// emails the lead the benchmark report PDF, and sends an internal notification.
// Runs as a Vercel serverless function (opted out of prerendering).
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { Resend } from 'resend';
import { corporateReadinessSchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';
import { readBody, redirect } from '../../lib/formBody';
import { readinessTier } from '../../lib/readiness';
import { readinessQuestions } from '../../data/content';
import { en } from '../../i18n/en';
import { SITE } from '../../data/seo';
import { LOGO_CID, readinessReportHtml, readinessReportText } from '../../lib/emails/readinessReport';
// Embedded in the email body via cid:, so the header renders without the client
// fetching anything from the deployment.
import logoBase64 from '../../../public/logo.png?base64';
// Inlined at build time (see `base64Asset` in astro.config.mjs), so the
// attachment never depends on the deployment being publicly fetchable.
// Deliberately NOT in public/: these reports are gated behind the form, and
// anything under public/ is served as a static file at a guessable URL.
import reportBase64 from '../../assets/reports/resetwellplus-state-of-menopause-report.pdf?base64';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

const copy = en.pages.workplaceReadiness;

// The lead magnet. Swap the file at src/assets/reports/ to change what gets sent
// (the import above picks it up at build time); the filename the recipient sees
// is set here.
const REPORT_FILENAME = 'ResetWell Plus - State of Menopause Report.pdf';

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const back = '/about/workplace-wellness/readiness-score/';
  const parsedBody = await readBody(request);
  if (!parsedBody) return json({ error: 'Invalid request body.' }, 400);
  const { data: body, isFormPost } = parsedBody;
  // A browser that posted the <form> itself cannot read a JSON reply, so every
  // exit below has to become a redirect for it.
  const fail = (message: string, status: number) =>
    isFormPost ? redirect(back) : json({ error: message }, status);

  // Honeypot: "website", not the usual "company" (which is a real field on this
  // form). Real users never fill it; bots do. Pretend success.
  if (str(body.website)) return isFormPost ? redirect('/thank-you/') : json({ ok: true });

  let ip: string | null = null;
  try { ip = clientAddress ?? null; } catch { ip = null; }
  if (rateLimited(ip)) {
    return fail('Too many submissions from your network. Please try again in a few minutes.', 429);
  }

  const parsed = corporateReadinessSchema.safeParse(body);
  if (!parsed.success) {
    return fail(firstError(parsed.error), 400);
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
  //
  // One row per work email: a retake overwrites the previous answers rather
  // than adding a second row. `xmax = 0` is true only for a genuine INSERT, so
  // it tells us whether this address has been through the assessment before.
  let isFirstSubmission = true;
  try {
    const columns = [
      'name', 'company', 'work_email', 'score', 'tier',
      ...readinessQuestions.map((q) => q.column),
      'source', 'ip_address',
    ];
    const values = [name, company, email, score, tier, ...answers, source, ip];
    // Placeholders and the update list are generated from the column list, so
    // adding a question to `readinessQuestions` (plus its column) needs no
    // change here.
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    const updates = columns
      .filter((c) => c !== 'work_email')
      .map((c) => `${c} = EXCLUDED.${c}`)
      .concat('updated_at = now()')
      .join(', ');
    const result = await db().query(
      `INSERT INTO corporate_readiness (${columns.join(', ')}) VALUES (${placeholders})
       ON CONFLICT (work_email) DO UPDATE SET ${updates}
       RETURNING (xmax = 0) AS is_new`,
      values
    );
    isFirstSubmission = result.rows[0]?.is_new === true;
  } catch (err) {
    console.error('[corporate-readiness] DB insert failed:', err);
    return fail('Sorry, something went wrong saving your answers. Please try again.', 500);
  }

  // 2) Email the report to the lead, and a notification to the team. Both are
  // best-effort: the submission is already saved either way.
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM || 'ResetWell Plus <onboarding@resend.dev>';

  // Answers spelled out for the internal notification.
  const answerLines = readinessQuestions.map((q, i) => {
    const label = answers[i] ? copy.inPlace : copy.gap;
    return `  [${label}] ${copy.questions[q.id].text}`;
  });

  // Shared by the HTML and plain-text parts of the lead's report email.
  const report = {
    name,
    company,
    score,
    total: readinessQuestions.length,
    tierLabel,
    tierCopy: copy.tiers[tier].copy,
    answers: readinessQuestions.map((q, i) => ({ text: copy.questions[q.id].text, yes: !!answers[i] })),
    inPlaceLabel: copy.inPlace,
    gapLabel: copy.gap,
    contactUrl: new URL('/contact/', SITE.url).href,
  };

  if (apiKey) {
    const resend = new Resend(apiKey);

    // The report goes out once per address. A retake updates the stored row and
    // is still reported internally, but the lead is not sent the PDF again.
    if (isFirstSubmission) {
      try {
        await resend.emails.send({
          from,
          to: email,
          ...(to ? { replyTo: to } : {}),
          subject: `Your menopause workplace readiness score: ${score}/${readinessQuestions.length} (${tierLabel})`,
          html: readinessReportHtml(report),
          // Sent alongside the HTML so text-only clients get a readable body
          // rather than a blank message.
          text: readinessReportText(report),
          // Base64 strings, not Buffers: the SDK puts `content` through
          // JSON.stringify, and a Buffer serialises to {"type":"Buffer",...}
          // rather than the base64 the API expects.
          attachments: [
            { filename: REPORT_FILENAME, content: reportBase64 },
            // contentId makes this an inline part referenced by the <img> in the
            // header rather than a file the recipient is asked to download.
            {
              filename: 'resetwell-plus-logo.png',
              content: logoBase64,
              contentType: 'image/png',
              contentId: LOGO_CID,
            },
          ],
        });
      } catch (err) {
        console.error('[corporate-readiness] Report email to lead failed (answers were still saved):', err);
      }
    }

    if (to) {
      try {
        await resend.emails.send({
          from,
          to,
          replyTo: email,
          subject: `${isFirstSubmission ? 'Readiness assessment' : 'Readiness retake'}: ${company} scored ${score}/${readinessQuestions.length} (${tierLabel})`,
          text: [
            `Name:    ${name}`,
            `Company: ${company}`,
            `Email:   ${email}`,
            `Score:   ${score}/${readinessQuestions.length} (${tierLabel})`,
            `Source:  ${source}`,
            isFirstSubmission
              ? 'Report:  sent to the lead'
              : 'Report:  not resent, this address already received it',
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

  // `reportSent` lets the page tell the visitor the report is already in their
  // inbox, rather than promising a second one that will never arrive.
  if (isFormPost) return redirect('/thank-you/');
  return json({ ok: true, reportSent: isFirstSubmission });
};

// Any non-POST method.
export const ALL: APIRoute = () => json({ error: 'Method not allowed.' }, 405);
