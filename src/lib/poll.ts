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
  /**
   * The run this poll is being read in: one open-to-close cycle. Null for a
   * question that has never been opened. Votes and tallies key on this, not on
   * the poll, so the same question asked again months later counts separately
   * and the same person may answer both times.
   */
  runId: number | null;
}

async function optionsFor(pollId: string): Promise<PollOption[]> {
  // Always `db().sql`, never a detached `const sql = db().sql`: the tagged
  // template reads the connection string off `this`, so pulling it off the
  // pool throws at query time.
  const rows = await db().sql`
    SELECT option_id, label FROM poll_options WHERE poll_id = ${pollId} ORDER BY position, option_id
  `;
  return rows.rows.map((o) => ({ id: o.option_id as string, label: o.label as string }));
}

/** One poll, paired with its most recent run. Null when the id is unknown. */
export async function getPoll(id: string): Promise<Poll | null> {
  const rows = await db().sql`
    SELECT p.id, p.question, p.intro, p.status,
           (SELECT r.id FROM poll_runs r WHERE r.poll_id = p.id ORDER BY r.opened_at DESC LIMIT 1) AS run_id
    FROM polls p WHERE p.id = ${id}
  `;
  if (rows.rowCount === 0) return null;
  const row = rows.rows[0];
  return {
    id: row.id,
    question: row.question,
    intro: row.intro,
    status: row.status,
    runId: row.run_id === null ? null : Number(row.run_id),
    options: await optionsFor(row.id),
  };
}

/** The poll in a specific run, so a finished round reads as it did then. */
export async function getPollByRun(runId: number): Promise<Poll | null> {
  const rows = await db().sql`
    SELECT p.id, p.question, p.intro, p.status, r.id AS run_id
    FROM poll_runs r JOIN polls p ON p.id = r.poll_id WHERE r.id = ${runId}
  `;
  if (rows.rowCount === 0) return null;
  const row = rows.rows[0];
  return {
    id: row.id,
    question: row.question,
    intro: row.intro,
    status: row.status,
    runId: Number(row.run_id),
    options: await optionsFor(row.id),
  };
}

/**
 * The poll currently accepting votes, or null when none is.
 *
 * Read from the live run rather than polls.status, so it cannot disagree with
 * where the votes are actually going. A partial unique index guarantees at most
 * one run is live, so this never silently picks one of several.
 */
export async function getOpenPoll(): Promise<Poll | null> {
  const rows = await db().sql`SELECT id FROM poll_runs WHERE closed_at IS NULL LIMIT 1`;
  return rows.rowCount === 0 ? null : getPollByRun(Number(rows.rows[0].id));
}

export interface Tally {
  pollId: string;
  runId: number;
  question: string;
  status: string;
  total: number;
  /** One entry per option, in display order, including options with no votes. */
  results: { id: string; label: string; votes: number }[];
}

/** Standing for one run. Never merges a question's separate runs. */
export async function tally(runId: number): Promise<Tally | null> {
  const poll = await getPollByRun(runId);
  if (!poll) return null;

  const rows = await db().sql`
    SELECT option_id, count(*)::int AS n FROM poll_votes WHERE run_id = ${runId} GROUP BY option_id
  `;
  const counts = new Map<string, number>(rows.rows.map((r) => [r.option_id as string, r.n as number]));

  return {
    pollId: poll.id,
    runId,
    question: poll.question,
    status: poll.status,
    total: [...counts.values()].reduce((a, b) => a + b, 0),
    results: poll.options.map((o) => ({ ...o, votes: counts.get(o.id) ?? 0 })),
  };
}

/** The option this respondent chose in this run, or null. */
export async function existingVote(runId: number, token: string): Promise<string | null> {
  const rows = await db().sql`
    SELECT option_id FROM poll_votes WHERE run_id = ${runId} AND token = ${token}
  `;
  return rows.rowCount === 0 ? null : (rows.rows[0].option_id as string);
}
