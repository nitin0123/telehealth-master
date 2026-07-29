-- Shared rate-limit counters for the form endpoints.
--
-- The previous limiter lived in memory inside each serverless instance, so it
-- only ever saw a fraction of the traffic: requests spread across warm
-- instances each got their own allowance, and a cold start reset the count.
-- Keeping the counter in Postgres makes the limit apply to the whole site.
--
-- One row per (endpoint, client) pair. Rows are cheap and self-healing: a
-- window older than the limit window is reset in place by the upsert rather
-- than accumulating, and stale rows are pruned opportunistically.

CREATE TABLE IF NOT EXISTS rate_limits (
  key           TEXT        PRIMARY KEY,          -- '<endpoint>:<ip>'
  window_start  TIMESTAMPTZ NOT NULL DEFAULT now(),
  hits          INTEGER     NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits (window_start);
