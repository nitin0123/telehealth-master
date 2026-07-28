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
-- Deliberately NOT unique on work_email: two people from the same company are
-- two data points, and a repeat assessment after a policy change is a signal
-- worth keeping rather than overwriting.
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
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_corporate_readiness_created_at ON corporate_readiness (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_corporate_readiness_company ON corporate_readiness (company);
