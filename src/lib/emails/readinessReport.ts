// HTML (and plain-text) body for the readiness assessment report email.
//
// Written to email-client constraints rather than the site's: table layout, all
// styles inline, no flexbox/grid, no web fonts and no images. Images are
// deliberately avoided because a remote logo would have to be fetched from the
// deployment, and preview deploys sit behind Vercel's auth wall (the same trap
// that broke the PDF attachment), so the wordmark is set in type instead.
//
// Brand colours are hard-coded here because email clients cannot read Tailwind:
// ever #6D28D9, clay #9333EA, sand #EADCF8, cream #FCFAFF, ink #2E2440,
// stone #6B6280.

import { WORDMARK, SITE } from '../../data/seo';

export interface ReadinessEmailInput {
  name: string;
  company: string;
  score: number;
  total: number;
  tierLabel: string;
  tierCopy: string;
  /** One entry per question, in the order they were asked. */
  answers: { text: string; yes: boolean }[];
  inPlaceLabel: string;
  gapLabel: string;
  contactUrl: string;
}

/** Escape text that came from a form before it goes anywhere near HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function readinessReportHtml(input: ReadinessEmailInput): string {
  const { name, company, score, total, tierLabel, tierCopy, answers, inPlaceLabel, gapLabel, contactUrl } = input;
  const firstName = esc(name.split(' ')[0] ?? name);
  const pct = Math.round((score / total) * 100);

  // The score bar is two nested tables rather than a progress element, which no
  // email client renders.
  const bar = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#EADCF8;border-radius:999px;">
      <tr><td style="padding:0;line-height:0;font-size:0;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="${pct}%" style="border-collapse:collapse;min-width:8px;">
          <tr><td style="height:8px;background:#6D28D9;border-radius:999px;line-height:8px;font-size:0;">&nbsp;</td></tr>
        </table>
      </td></tr>
    </table>`;

  const rows = answers
    .map(({ text, yes }) => {
      const label = yes ? inPlaceLabel : gapLabel;
      const chipBg = yes ? '#EDE4FB' : '#FBEDE4';
      const chipFg = yes ? '#4C1D95' : '#9A4A16';
      return `
      <tr>
        <td style="padding:10px 12px 10px 0;vertical-align:top;white-space:nowrap;">
          <span style="display:inline-block;padding:3px 10px;border-radius:999px;background:${chipBg};color:${chipFg};font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;">${esc(label)}</span>
        </td>
        <td style="padding:10px 0;vertical-align:top;font-size:14px;line-height:1.5;color:${yes ? '#6B6280' : '#2E2440'};font-weight:${yes ? '400' : '600'};">${esc(text)}</td>
      </tr>`;
    })
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>Your menopause workplace readiness score</title>
</head>
<body style="margin:0;padding:0;background:#F4EEFB;">
  <!-- Preheader: the grey line clients show next to the subject. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${esc(company)} scored ${score} out of ${total} (${esc(tierLabel)}). The full report is attached.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#F4EEFB;">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse:collapse;width:100%;max-width:600px;background:#FCFAFF;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

          <!-- Header -->
          <tr>
            <td style="padding:22px 32px;background:#6D28D9;">
              <span style="font-size:17px;font-weight:700;color:#FCFAFF;letter-spacing:-0.01em;">${esc(WORDMARK)}</span>
              <span style="font-size:12px;color:#D9C9F7;padding-left:10px;">Workplace Readiness</span>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:30px 32px 0;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#2E2440;">Hi ${firstName},</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#2E2440;">
                Here is where <strong style="color:#6D28D9;">${esc(company)}</strong> landed on the ${esc(WORDMARK)} menopause workplace readiness assessment.
              </p>
            </td>
          </tr>

          <!-- Score card -->
          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#F7F2FE;border:1px solid #EADCF8;border-radius:14px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                      <tr>
                        <td style="vertical-align:middle;">
                          <span style="font-size:38px;font-weight:700;color:#6D28D9;line-height:1;">${score}</span>
                          <span style="font-size:16px;color:#6B6280;">&nbsp;/ ${total}</span>
                        </td>
                        <td align="right" style="vertical-align:middle;">
                          <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:#6D28D9;color:#FCFAFF;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">${esc(tierLabel)}</span>
                        </td>
                      </tr>
                    </table>
                    <div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>
                    ${bar}
                    <p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:#4E3F68;">${esc(tierCopy)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Answers -->
          <tr>
            <td style="padding:26px 32px 0;">
              <p style="margin:0 0 2px;font-size:11px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:#9333EA;">Where the gaps are</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                ${rows}
              </table>
            </td>
          </tr>

          <!-- Attachment note -->
          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#F7F2FE;border-radius:12px;">
                <tr>
                  <td style="padding:16px 20px;font-size:14px;line-height:1.6;color:#4E3F68;">
                    <strong style="color:#2E2440;">The full State of Menopause report is attached.</strong><br>
                    It sets out what the data says about midlife women at work in India, and what the companies getting this right are actually doing.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:26px 32px 4px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                <tr>
                  <td style="border-radius:999px;background:#9333EA;">
                    <a href="${esc(contactUrl)}" style="display:inline-block;padding:13px 30px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">Talk to us about a pilot</a>
                  </td>
                </tr>
              </table>
              <p style="margin:14px 0 0;font-size:13px;line-height:1.6;color:#6B6280;">Or just reply to this email and we will pick it up from there.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:26px 32px 30px;">
              <div style="height:1px;background:#EADCF8;line-height:1px;font-size:0;">&nbsp;</div>
              <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#8A7BA3;">
                ${esc(WORDMARK)} &middot; <a href="${esc(SITE.url)}" style="color:#9333EA;text-decoration:none;">resetwellplus.com</a><br>
                You are receiving this because you completed the workplace readiness assessment.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Plain-text alternative, for clients that will not render the HTML part. */
export function readinessReportText(input: ReadinessEmailInput): string {
  const { name, company, score, total, tierLabel, tierCopy, answers, inPlaceLabel, gapLabel } = input;
  // Bracketed labels rather than padded columns: proportional fonts make
  // space-padding ragged, which is what the plain-text version looked like.
  const lines = answers.map(({ text, yes }) => `  [${yes ? inPlaceLabel : gapLabel}] ${text}`);
  return [
    `Hi ${name.split(' ')[0] ?? name},`,
    '',
    `Here is where ${company} landed on the ${WORDMARK} menopause workplace readiness assessment.`,
    '',
    `Score: ${score} out of ${total}`,
    `Tier:  ${tierLabel}`,
    '',
    tierCopy,
    '',
    'Where the gaps are:',
    ...lines,
    '',
    'The full State of Menopause report is attached.',
    '',
    'If you would like to talk through what a pilot looks like for your teams, just reply to this email.',
    '',
    WORDMARK,
    SITE.url,
  ].join('\n');
}
