-- Mailing-list / community subscribers
-- Stores every email captured from the community "Join the Community" form and
-- the "Notify me" form on the coming-soon page.
--
-- Dialect: PostgreSQL (works with Vercel Postgres / Neon / Supabase).
-- The /api/subscribe endpoint inserts one row per signup and also emails a
-- notification via Resend. Idempotent on email: a repeat signup updates the
-- timestamp/source rather than erroring or duplicating.

CREATE TABLE IF NOT EXISTS subscribers (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       TEXT        NOT NULL UNIQUE,
  source      TEXT,                                -- e.g. 'community-join' | 'coming-soon'
  ip_address  TEXT,                                -- captured server-side
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),  -- first signup
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()   -- last signup attempt
);

CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at DESC);
