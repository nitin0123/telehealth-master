-- Poll tables.
--
-- All of these live in one file because they are created together and the later
-- tables reference the earlier ones; migrate.sh applies db/*.sql in alphabetical
-- order, so splitting them would make creation order a matter of filenames.
--
-- Everything about a poll lives in the database: the question, its options and
-- whether it is running. Nothing is hardcoded in the site, so a new question is
-- an INSERT rather than a deploy. Because of that the poll pages are
-- server-rendered (`prerender = false`) instead of static.
--
-- Dialect: PostgreSQL (Vercel Postgres / Neon).

-- ---------------------------------------------------------------------------
-- Questions
-- ---------------------------------------------------------------------------
--   draft  -> not accepting votes; the page says voting is not open
--   open   -> accepting votes. At most ONE poll may be open, enforced below
--   closed -> not accepting votes; results stay viewable
CREATE TABLE IF NOT EXISTS polls (
  id         TEXT        PRIMARY KEY,   -- short slug, e.g. 'workplace-menopause-policy'
  question   TEXT        NOT NULL,
  intro      TEXT,                      -- optional line under the question
  status     TEXT        NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'polls_status_check') THEN
    ALTER TABLE polls ADD CONSTRAINT polls_status_check
      CHECK (status IN ('draft', 'open', 'closed'));
  END IF;
END $$;

-- "Only one poll runs at a time" as a database rule rather than a habit.
-- Opening a second poll while one is already open fails loudly instead of
-- quietly splitting the audience across two questions.
CREATE UNIQUE INDEX IF NOT EXISTS idx_polls_single_open
  ON polls ((status)) WHERE status = 'open';

-- ---------------------------------------------------------------------------
-- Options
-- ---------------------------------------------------------------------------
-- `option_id` is what gets written into poll_votes, so it must never change
-- once votes exist: renaming a label is safe, renaming an id orphans the votes.
CREATE TABLE IF NOT EXISTS poll_options (
  poll_id   TEXT    NOT NULL REFERENCES polls (id) ON DELETE CASCADE,
  option_id TEXT    NOT NULL,
  label     TEXT    NOT NULL,
  position  INT     NOT NULL DEFAULT 0,   -- display order, low to high
  PRIMARY KEY (poll_id, option_id)
);

CREATE INDEX IF NOT EXISTS idx_poll_options_order ON poll_options (poll_id, position);

-- ---------------------------------------------------------------------------
-- Respondents
-- ---------------------------------------------------------------------------
-- Someone who has given us their details once and may then vote on every poll.
-- The token is the value held in their cookie: an opaque id, so the cookie
-- carries no company name or phone number.
CREATE TABLE IF NOT EXISTS poll_respondents (
  token      TEXT        PRIMARY KEY,
  name       TEXT        NOT NULL DEFAULT '',
  company    TEXT        NOT NULL,
  phone      TEXT        NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Existing installs predating the name column.
ALTER TABLE poll_respondents ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_poll_respondents_phone      ON poll_respondents (phone);
CREATE INDEX IF NOT EXISTS idx_poll_respondents_created_at ON poll_respondents (created_at DESC);

-- ---------------------------------------------------------------------------
-- Votes
-- ---------------------------------------------------------------------------
-- One vote per respondent per poll, enforced by the primary key. That makes the
-- rule as strong as the cookie holding the token: clearing cookies yields a new
-- token and therefore a new vote, which is the agreed behaviour.
--
-- `company` and `phone` are copied in rather than only joined, so a vote row is
-- self-contained: who answered, and what they answered, without a join. That
-- also makes repeat voting from a fresh browser findable afterwards:
--
--   SELECT poll_id, phone, count(*) FROM poll_votes
--   GROUP BY 1, 2 HAVING count(*) > 1;
--
-- Add UNIQUE (poll_id, phone) to make one-vote-per-person absolute.
CREATE TABLE IF NOT EXISTS poll_votes (
  poll_id    TEXT        NOT NULL REFERENCES polls (id) ON DELETE CASCADE,
  token      TEXT        NOT NULL REFERENCES poll_respondents (token),
  option_id  TEXT        NOT NULL,
  company    TEXT        NOT NULL DEFAULT '',
  phone      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (poll_id, token)
);

-- Existing installs predating the company column.
ALTER TABLE poll_votes ADD COLUMN IF NOT EXISTS company TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_poll_votes_tally ON poll_votes (poll_id, option_id);

-- ---------------------------------------------------------------------------
-- Who answered what
-- ---------------------------------------------------------------------------
-- The attribution view: one row per answer with the respondent attached and the
-- option label resolved, so reading the results needs no joins by hand.
--
--   SELECT * FROM poll_responses WHERE poll_id = 'workplace-menopause-policy';
--
-- A respondent identifies once and then answers every poll, so filtering by
-- phone shows one person's answers across all of them.
CREATE OR REPLACE VIEW poll_responses AS
SELECT
  v.poll_id,
  p.question,
  r.name,
  v.company,
  v.phone,
  v.option_id,
  o.label AS answer,
  v.created_at AS answered_at,
  r.created_at AS registered_at,
  v.token
FROM poll_votes v
JOIN polls p            ON p.id = v.poll_id
JOIN poll_respondents r ON r.token = v.token
LEFT JOIN poll_options o ON o.poll_id = v.poll_id AND o.option_id = v.option_id;

-- ---------------------------------------------------------------------------
-- Seed: the first question. Idempotent, and it never reopens a live poll.
-- ---------------------------------------------------------------------------
-- Both seed as 'draft'. Open one when you are ready:
--   UPDATE polls SET status = 'open',   updated_at = now() WHERE id = '<id>';
--   UPDATE polls SET status = 'closed', updated_at = now() WHERE id = '<id>';
-- The partial unique index above rejects a second 'open' row, so close the
-- running poll before opening the next.
INSERT INTO polls (id, question, intro, status) VALUES
  ('workplace-menopause-policy',
   'Do you have a workplace menopause policy?',
   'One question, one answer. We will share what the results say about menopause support across Indian workplaces.',
   'draft'),
  ('ready-to-partner',
   'Are you ready to partner with us?',
   'One question, one answer. Your response tells us where to focus next.',
   'draft')
ON CONFLICT (id) DO NOTHING;

INSERT INTO poll_options (poll_id, option_id, label, position) VALUES
  ('workplace-menopause-policy', 'yes',      'Yes',      1),
  ('workplace-menopause-policy', 'no',       'No',       2),
  ('workplace-menopause-policy', 'not-sure', 'Not sure', 3),
  ('ready-to-partner',           'yes',      'Yes',            1),
  ('ready-to-partner',           'maybe',    'Maybe',          2),
  ('ready-to-partner',           'not-now',  'Not right now',  3)
ON CONFLICT (poll_id, option_id) DO NOTHING;
