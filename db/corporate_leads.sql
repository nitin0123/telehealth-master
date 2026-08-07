-- Corporate resource downloads (currently the Workplace Wellness two-pager)
-- One row per HR/CXO lead who asked for a gated corporate resource from
-- /about/workplace-wellness/. Kept separate from `corporate_readiness` because
-- there is no score or set of answers here, only a request for a document.
--
-- Dialect: PostgreSQL (works with Vercel Postgres / Neon / Supabase).
-- The /api/corporate-lead endpoint inserts one row per request, emails the
-- requested PDF, and sends an internal notification via Resend.
--
-- One row per (work_email, resource): the same person may legitimately request
-- two different documents, but asking for the same one twice updates the
-- existing row rather than adding another, and the email is not resent.

CREATE TABLE IF NOT EXISTS corporate_leads (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT        NOT NULL,
  company     TEXT        NOT NULL,
  work_email  TEXT        NOT NULL,
  resource    TEXT        NOT NULL,               -- e.g. 'two-pager'
  source      TEXT,                               -- e.g. 'workplace-wellness'
  ip_address  TEXT,                               -- captured server-side
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(), -- first request
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()  -- most recent request
);

CREATE INDEX IF NOT EXISTS idx_corporate_leads_created_at ON corporate_leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corporate_leads_company ON corporate_leads (company);
-- Makes the endpoint's ON CONFLICT (work_email, resource) upsert work.
CREATE UNIQUE INDEX IF NOT EXISTS idx_corporate_leads_email_resource ON corporate_leads (work_email, resource);
