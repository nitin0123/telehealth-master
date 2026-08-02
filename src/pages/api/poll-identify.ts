// Captures a poll respondent's company and phone, once, and hands back the
// token their browser keeps. Later polls read that token and skip this step.
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { newToken, RESPONDENT_COOKIE } from '../../lib/poll';
import { pollIdentifySchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';
import { readBody } from '../../lib/formBody';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export const POST: APIRoute = async ({ request, clientAddress, cookies }) => {
  const parsed = await readBody(request);
  if (!parsed) return json({ error: 'Invalid request body.' }, 400);
  const body = parsed.data;

  // Honeypot. "website", not the usual "company": this form asks for the
  // company as a real field. A hit gets a plausible success so bots learn
  // nothing, but no row is written and no cookie is set.
  if (str(body.website)) return json({ ok: true });

  if (await rateLimited(clientAddress, 'poll-identify')) {
    return json({ error: 'Too many attempts. Please try again in a few minutes.' }, 429);
  }

  const result = pollIdentifySchema.safeParse(body);
  if (!result.success) return json({ error: firstError(result.error) }, 400);

  // A repeat visitor who still holds a valid token keeps it, so re-submitting
  // the form does not fragment one person into several respondents.
  const existing = cookies.get(RESPONDENT_COOKIE)?.value;
  if (existing) {
    const known = await db().sql`SELECT 1 FROM poll_respondents WHERE token = ${existing}`;
    if (known.rowCount > 0) return json({ ok: true, token: existing });
  }

  const token = newToken();
  await db().sql`
    INSERT INTO poll_respondents (token, company, phone, ip_address, user_agent)
    VALUES (${token}, ${result.data.company}, ${result.data.phone},
            ${clientAddress ?? null}, ${request.headers.get('user-agent') ?? null})
  `;

  // Not httpOnly: the poll page's own script reads it to decide whether to show
  // the identity step. It is an opaque id, so exposing it to JS reveals nothing.
  cookies.set(RESPONDENT_COOKIE, token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: true,
  });

  return json({ ok: true, token });
};
