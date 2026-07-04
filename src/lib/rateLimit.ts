// Small in-memory rate limiter shared by the form endpoints.
//
// Serverless instances don't share memory, so this bounds abuse per warm
// instance rather than globally. That is enough to blunt casual scripted spam
// (which hammers one endpoint and lands on the same warm instance) without a
// datastore; move to a shared store (e.g. a table or Vercel WAF rule) if the
// site ever attracts targeted abuse.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_HITS = 5; // submissions allowed per IP per window

const hits = new Map<string, number[]>();

/** Records a hit for `ip` and reports whether it is over the limit. */
export function rateLimited(ip: string | null): boolean {
  if (!ip) return false;
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow without bound on a long-lived
  // instance being spammed from many addresses.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}
