// HTML (and plain-text) body for the gated corporate resource email.
//
// Same email-client constraints as the readiness report: table layout, inline
// styles, no web fonts, and the logo embedded as a cid: attachment rather than
// fetched over HTTP. See ./readinessReport.ts for the reasoning.

import { WORDMARK, SITE } from '../../data/seo';
import { LOGO_CID } from './readinessReport';

export interface CorporateResourceEmailInput {
  name: string;
  company: string;
  /** Human-readable document name, e.g. 'Corporate Wellness two-pager'. */
  resourceLabel: string;
  contactUrl: string;
  readinessUrl: string;
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function corporateResourceHtml(input: CorporateResourceEmailInput): string {
  const { name, company, resourceLabel, contactUrl, readinessUrl } = input;
  const firstName = esc(name.split(' ')[0] ?? name);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<meta name="supported-color-schemes" content="light only">
<title>${esc(resourceLabel)}</title>
</head>
<body style="margin:0;padding:0;background:#F4EEFB;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    The ${esc(resourceLabel)} is attached, ready to share with your team.
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#F4EEFB;">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse:collapse;width:100%;max-width:600px;background:#FCFAFF;border-radius:16px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

          <tr>
            <td style="padding:20px 32px 18px;background:#FFFFFF;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding-right:12px;vertical-align:middle;line-height:0;">
                    <img src="cid:${LOGO_CID}" alt="${esc(WORDMARK)}" width="46" height="46" style="display:block;width:46px;height:46px;border:0;outline:none;text-decoration:none;border-radius:23px;">
                  </td>
                  <td style="vertical-align:middle;">
                    <div style="font-size:17px;font-weight:700;color:#6D28D9;letter-spacing:-0.01em;line-height:1.2;">${esc(WORDMARK)}</div>
                    <div style="font-size:12px;color:#8A7BA3;padding-top:2px;">Workplace Wellness</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style="height:4px;background:#6D28D9;line-height:4px;font-size:0;">&nbsp;</td></tr>

          <tr>
            <td style="padding:30px 32px 0;">
              <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#2E2440;">Hi ${firstName},</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:#2E2440;">
                Thanks for your interest in bringing menopause support to <strong style="color:#6D28D9;">${esc(company)}</strong>. The ${esc(resourceLabel)} is attached, ready to circulate internally.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#F7F2FE;border:1px solid #EADCF8;border-radius:14px;">
                <tr>
                  <td style="padding:18px 22px;font-size:14px;line-height:1.6;color:#4E3F68;">
                    <strong style="color:#2E2440;">Want to see where you stand first?</strong><br>
                    The Menopause Workplace Readiness Score is six questions and gives you an instant benchmark for your organisation.
                    <br><br>
                    <a href="${esc(readinessUrl)}" style="color:#9333EA;font-weight:600;text-decoration:none;">Take the readiness assessment &rarr;</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

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

          <tr>
            <td style="padding:26px 32px 30px;">
              <div style="height:1px;background:#EADCF8;line-height:1px;font-size:0;">&nbsp;</div>
              <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#8A7BA3;">
                ${esc(WORDMARK)} &middot; <a href="${esc(SITE.url)}" style="color:#9333EA;text-decoration:none;">resetwellplus.com</a><br>
                You are receiving this because you requested the ${esc(resourceLabel)}.
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

export function corporateResourceText(input: CorporateResourceEmailInput): string {
  const { name, company, resourceLabel, readinessUrl } = input;
  return [
    `Hi ${name.split(' ')[0] ?? name},`,
    '',
    `Thanks for your interest in bringing menopause support to ${company}. The ${resourceLabel} is attached, ready to circulate internally.`,
    '',
    'Want to see where you stand first? The Menopause Workplace Readiness Score is six questions and gives you an instant benchmark:',
    readinessUrl,
    '',
    'If you would like to talk through what a pilot looks like for your teams, just reply to this email.',
    '',
    WORDMARK,
    SITE.url,
  ].join('\n');
}
