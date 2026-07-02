-- Contact form submissions
-- Stores every message sent from the /contact page, with the date/time received.
--
-- Dialect: PostgreSQL (works with Vercel Postgres / Neon / Supabase).
-- The /api/contact endpoint inserts one row per submission and also emails it
-- via Resend.

CREATE TABLE IF NOT EXISTS contact_messages (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  message     TEXT        NOT NULL,
  ip_address  TEXT,                                -- captured server-side
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()   -- date & time received
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email      ON contact_messages (email);
