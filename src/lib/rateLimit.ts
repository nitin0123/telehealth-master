// Rate limiting for the form endpoints.
//
// Backed by Postgres so the limit applies across the whole site. The previous
// implementation counted in memory inside each serverless instance, which meant
// requests spread over several warm instances each got a full allowance and a
// cold start wiped the count entirely.
//
// The in-memory counter is kept as a fast local pre-check and as the fallback
// when the database is unreachable: a limiter that fails open is better than an
// endpoint that 500s, since the honeypot and validation still apply.
import { db } from './db';

const WINDOW_MINUTES = 10;

/**
 * Submissions allowed per IP per window, per endpoint.
 *
 * Not one number for the whole site, because the endpoints are not alike:
 *
 * - Contact-style forms stay tight. One person filling in one form more than
 *   five times in ten minutes is not a person.
 *
 * - The poll is the opposite case, and by a long way. It is answered by a live
 *   audience in an auditorium on one shared wifi, so every person in the room
 *   arrives from the SAME public IP inside a few minutes. Five hundred people
 *   is a thousand requests on one IP, and any per-IP cap tuned for abuse would
 *   reject most of the room. These ceilings therefore exist only to stop a
 *   runaway script, not to police the audience: real abuse is caught by the
 *   honeypot, by voting requiring an identity first, and by the (poll_id,
 *   token) primary key that makes a second vote impossible however many times
 *   it is submitted.
 *
 * - `poll-auth` guards a password and is used by us, not the room, so it stays
 *   as tight as the ordinary forms. Raising it trades real brute-force
 *   protection for nothing.
 */
const LIMITS: Record<string, number> = {
  default: 5,
  // Headroom for a full room plus retries and flaky-wifi resubmissions.
  'poll-identify': 2000,
  'poll-vote': 2000,
  // Listed rather than left to fall through to `default`, so raising the
  // default for ordinary forms can never quietly loosen the password gate.
  'poll-auth': 5,
};

/** Submissions allowed for `scope` in one window. */
const maxHits = (scope: string): number => LIMITS[scope] ?? LIMITS.default;

const hits = new Map<string, number[]>();

/** Local, per-instance counter. Cheap, and covers the DB-unavailable case. */
function memoryLimited(key: string, limit: number): boolean {
  const now = Date.now();
  const windowMs = WINDOW_MINUTES * 60 * 1000;

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

/**
 * Records a hit for `ip` against `scope` and reports whether it is over the
 * limit. `scope` keeps endpoints independent, so contact-form spam cannot lock
 * someone out of the newsletter signup.
 */
export async function rateLimited(ip: string | null, scope = 'default'): Promise<boolean> {
  if (!ip) return false;
  const key = `${scope}:${ip}`;
  const limit = maxHits(scope);

  // A local hit already over the limit needs no round trip.
  if (memoryLimited(key, limit)) return true;

  try {
    // Single statement, so concurrent requests cannot interleave a read and a
    // write. A window older than WINDOW_MINUTES resets the counter in place.
    const result = await db().query(
      `INSERT INTO rate_limits (key, window_start, hits)
       VALUES ($1, now(), 1)
       ON CONFLICT (key) DO UPDATE SET
         hits = CASE
           WHEN rate_limits.window_start < now() - ($2 || ' minutes')::interval THEN 1
           ELSE rate_limits.hits + 1
         END,
         window_start = CASE
           WHEN rate_limits.window_start < now() - ($2 || ' minutes')::interval THEN now()
           ELSE rate_limits.window_start
         END
       RETURNING hits`,
      [key, String(WINDOW_MINUTES)]
    );
    return (result.rows[0]?.hits ?? 0) > limit;
  } catch (err) {
    // Fail open: the local counter above has already been applied.
    console.error('[rateLimit] DB check failed, falling back to in-memory only:', err);
    return false;
  }
}
