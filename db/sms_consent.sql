-- SMS consent capture table
-- Stores each opt-in submitted from /sms-consent as documented proof of consent,
-- including the exact date/time it was recorded.
--
-- Dialect: PostgreSQL (works with Vercel Postgres / Neon / Supabase).
-- The /sms-consent form payload maps directly to these columns:
--   phoneNumber          -> phone_number
--   consentMarketing     -> consent_marketing
--   consentInformational -> consent_informational
--   timestamp            -> created_at (defaults to now() if not supplied)

CREATE TABLE IF NOT EXISTS sms_consent (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  phone_number          TEXT        NOT NULL,
  consent_marketing     BOOLEAN     NOT NULL DEFAULT FALSE,
  consent_informational BOOLEAN     NOT NULL DEFAULT FALSE,
  ip_address            TEXT,                      -- captured server-side for proof of consent
  user_agent            TEXT,                      -- captured server-side for proof of consent
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()  -- date & time consent was recorded
);

-- Look up / de-duplicate by phone number, and report by recency.
CREATE INDEX IF NOT EXISTS idx_sms_consent_phone      ON sms_consent (phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_consent_created_at ON sms_consent (created_at DESC);
