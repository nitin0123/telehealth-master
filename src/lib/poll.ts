// Poll helpers: identity cookie, results password, reading polls and tallying.
//
// Everything about a poll comes from the database (see db/polls.sql), so the
// poll pages are server-rendered rather than static.
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { db } from './db';

/** Opaque respondent id. Readable by page JS, which is why it carries no PII. */
export const RESPONDENT_COOKIE = 'rw_poll_id';
/** Proof the visitor entered the results password. */
export const RESULTS_COOKIE = 'rw_poll_results';

/** A respondent token. Opaque, so a leaked cookie reveals nothing about them. */
export const newToken = () => randomUUID();

const RESULTS_PASSWORD = () => process.env.POLL_RESULTS_PASSWORD ?? '';

/**
 * Cookie value proving the results password was entered.
 *
 * An HMAC of a fixed label keyed by the password itself, so there is no session
 * store to keep and no second secret to configure. Changing the password
 * invalidates every issued cookie, which is the behaviour you want.
 */
export function issueResultsToken(): string {
  return createHmac('sha256', RESULTS_PASSWORD()).update('poll-results-v1').digest('hex');
}

/** Constant-time compare that tolerates differing lengths. */
function sameSecret(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** True when the submitted password matches POLL_RESULTS_PASSWORD. */
export function passwordMatches(submitted: string): boolean {
  const expected = RESULTS_PASSWORD();
  // An unset env var must never authenticate, least of all an empty submission
  // against an empty secret, so bail before comparing rather than after.
  if (!expected) return false;
  return sameSecret(submitted, expected);
}

/** True when the request carries a valid results cookie. */
export function hasResultsAccess(cookieValue: string | undefined): boolean {
  if (!cookieValue || !RESULTS_PASSWORD()) return false;
  return sameSecret(cookieValue, issueResultsToken());
}

export interface PollOption {
  id: string;
  label: string;
}

export interface Poll {
  id: string;
  question: string;
  intro: string | null;
  status: 'draft' | 'open' | 'closed';
  options: PollOption[];
}

/** One poll with its options, or null when the id is unknown. */
export async function getPoll(id: string): Promise<Poll | null> {
  // Always `db().sql`, never a detached `const sql = db().sql`: the tagged
  // template reads the connection string off `this`, so pulling it off the
  // pool throws at query time.
  const polls = await db().sql`SELECT id, question, intro, status FROM polls WHERE id = ${id}`;
  if (polls.rowCount === 0) return null;
  const options = await db().sql`
    SELECT option_id, label FROM poll_options WHERE poll_id = ${id} ORDER BY position, option_id
  `;
  const row = polls.rows[0];
  return {
    id: row.id,
    question: row.question,
    intro: row.intro,
    status: row.status,
    options: options.rows.map((o) => ({ id: o.option_id, label: o.label })),
  };
}

/**
 * The poll currently accepting votes, or null when none is.
 *
 * A partial unique index guarantees at most one row is open, so this cannot
 * silently pick one of several.
 */
export async function getOpenPoll(): Promise<Poll | null> {
  const rows = await db().sql`SELECT id FROM polls WHERE status = 'open' LIMIT 1`;
  return rows.rowCount === 0 ? null : getPoll(rows.rows[0].id);
}

/** Every poll, newest first, for the results page's picker. */
export async function listPolls(): Promise<{ id: string; question: string; status: string }[]> {
  const rows = await db().sql`SELECT id, question, status FROM polls ORDER BY created_at DESC`;
  return rows.rows as { id: string; question: string; status: string }[];
}

export interface Tally {
  pollId: string;
  question: string;
  status: string;
  total: number;
  /** One entry per option, in display order, including options with no votes. */
  results: { id: string; label: string; votes: number }[];
}

/** Current standing for one poll. */
export async function tally(pollId: string): Promise<Tally | null> {
  const poll = await getPoll(pollId);
  if (!poll) return null;

  const rows = await db().sql`
    SELECT option_id, count(*)::int AS n FROM poll_votes WHERE poll_id = ${pollId} GROUP BY option_id
  `;
  const counts = new Map<string, number>(rows.rows.map((r) => [r.option_id as string, r.n as number]));

  return {
    pollId: poll.id,
    question: poll.question,
    status: poll.status,
    total: [...counts.values()].reduce((a, b) => a + b, 0),
    results: poll.options.map((o) => ({ ...o, votes: counts.get(o.id) ?? 0 })),
  };
}

/** The option this respondent already chose for a poll, or null. */
export async function existingVote(pollId: string, token: string): Promise<string | null> {
  const rows = await db().sql`
    SELECT option_id FROM poll_votes WHERE poll_id = ${pollId} AND token = ${token}
  `;
  return rows.rowCount === 0 ? null : (rows.rows[0].option_id as string);
}
