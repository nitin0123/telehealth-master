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
const MAX_HITS = 5; // submissions allowed per IP per window, per endpoint

const hits = new Map<string, number[]>();

/** Local, per-instance counter. Cheap, and covers the DB-unavailable case. */
function memoryLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = WINDOW_MINUTES * 60 * 1000;

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= MAX_HITS) {
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

  // A local hit already over the limit needs no round trip.
  if (memoryLimited(key)) return true;

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
    return (result.rows[0]?.hits ?? 0) > MAX_HITS;
  } catch (err) {
    // Fail open: the local counter above has already been applied.
    console.error('[rateLimit] DB check failed, falling back to in-memory only:', err);
    return false;
  }
}
