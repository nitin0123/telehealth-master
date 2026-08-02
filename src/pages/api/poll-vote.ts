// Records one vote. Refuses unless the poll is open, the option is real, and
// the voter has identified themselves.
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/db';
import { getPoll, RESPONDENT_COOKIE } from '../../lib/poll';
import { pollVoteSchema, firstError } from '../../lib/schemas';
import { rateLimited } from '../../lib/rateLimit';
import { readBody } from '../../lib/formBody';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, clientAddress, cookies }) => {
  const parsed = await readBody(request);
  if (!parsed) return json({ error: 'Invalid request body.' }, 400);

  if (await rateLimited(clientAddress, 'poll-vote')) {
    return json({ error: 'Too many attempts. Please try again in a few minutes.' }, 429);
  }

  const result = pollVoteSchema.safeParse(parsed.data);
  if (!result.success) return json({ error: firstError(result.error) }, 400);

  const token = cookies.get(RESPONDENT_COOKIE)?.value;
  if (!token) return json({ error: 'Please enter your details before voting.' }, 401);

  const respondent = await db().sql`SELECT company, phone FROM poll_respondents WHERE token = ${token}`;
  if (respondent.rowCount === 0) {
    // A token we have never seen: most likely a cookie surviving a database
    // reset. Ask for details again rather than inventing a respondent.
    return json({ error: 'Please enter your details before voting.' }, 401);
  }

  const poll = await getPoll(result.data.poll);
  if (!poll) return json({ error: 'That poll does not exist.' }, 404);
  // Both checks matter: the status says it should be running, the run says
  // where the vote goes. A poll with no live run cannot receive one.
  if (poll.status !== 'open' || poll.runId === null) {
    return json({ error: 'This poll is not accepting votes.' }, 409);
  }

  // Never trust the submitted option: it must be one this poll actually offers.
  if (!poll.options.some((o) => o.id === result.data.option)) {
    return json({ error: 'That is not an option on this poll.' }, 400);
  }

  // One vote per respondent per RUN is the table's primary key, so a double
  // submission is absorbed here rather than racing two inserts. Keyed on the
  // run, so this same person may answer again when the question runs afresh.
  const written = await db().sql`
    INSERT INTO poll_votes (run_id, poll_id, token, option_id, company, phone)
    VALUES (${poll.runId}, ${poll.id}, ${token}, ${result.data.option},
            ${respondent.rows[0].company}, ${respondent.rows[0].phone})
    ON CONFLICT (run_id, token) DO NOTHING
    RETURNING option_id
  `;

  if (written.rowCount === 0) {
    const already = await db().sql`
      SELECT option_id FROM poll_votes WHERE run_id = ${poll.runId} AND token = ${token}
    `;
    return json({ ok: true, alreadyVoted: true, option: already.rows[0]?.option_id ?? null });
  }

  return json({ ok: true, option: result.data.option });
};
