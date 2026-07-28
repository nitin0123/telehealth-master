-- Corporate menopause-readiness assessment submissions
-- One row per completed assessment on /about/workplace-wellness/readiness-score/.
-- Captures the HR/CXO lead's details alongside their six yes/no answers, so the
-- responses double as benchmark data ("what share of companies have a written
-- policy?") rather than just a contact list.
--
-- Dialect: PostgreSQL (works with Vercel Postgres / Neon / Supabase).
-- The /api/corporate-readiness endpoint inserts one row per submission, emails
-- the lead the report PDF, and sends an internal notification via Resend.
--
-- One row per work email: a repeat assessment updates the existing row instead
-- of adding another, and the report is emailed only on the first submission so
-- nobody receives it twice. Two people from the same company still get a row
-- each, since the key is the email and not the company.
--
-- The six q_* columns map 1:1 to `readinessQuestions` in src/data/content.ts.
-- Adding or reordering a question there means adding a column here with an
-- idempotent ALTER TABLE ... ADD COLUMN IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS corporate_readiness (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name                  TEXT        NOT NULL,
  company               TEXT        NOT NULL,
  work_email            TEXT        NOT NULL,
  score                 SMALLINT    NOT NULL,               -- 0-6, the count of "yes" answers
  tier                  TEXT        NOT NULL,               -- 'reactive' | 'developing' | 'leading'
  q_policy              BOOLEAN,                            -- written menopause/midlife policy
  q_hrt_coverage        BOOLEAN,                            -- benefits cover HRT consultations
  q_attrition_tracked   BOOLEAN,                            -- attrition tracked for women 45+
  q_manager_training    BOOLEAN,                            -- managers trained to support
  q_flexibility         BOOLEAN,                            -- flexible/remote tied to health needs
  q_leadership_voice    BOOLEAN,                            -- leadership has spoken publicly
  source                TEXT,                               -- e.g. 'hr-summit' | 'website'
  ip_address            TEXT,                               -- captured server-side
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(), -- first assessment
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()  -- most recent retake
);

CREATE INDEX IF NOT EXISTS idx_corporate_readiness_created_at ON corporate_readiness (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corporate_readiness_company ON corporate_readiness (company);

-- Added after the table first shipped. push.sh creates missing tables but never
-- alters existing ones, so these run as idempotent statements to bring an
-- already-created table up to date. The unique index is what makes the
-- endpoint's ON CONFLICT (work_email) upsert work.
ALTER TABLE corporate_readiness ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS idx_corporate_readiness_work_email ON corporate_readiness (work_email);
