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
-- Runs
-- ---------------------------------------------------------------------------
-- One row per open->close cycle. A question can be asked again months later,
-- and that later asking is a separate poll with its own count: the same person
-- may answer both, and the two tallies never mix.
--
-- You do not manage these by hand. The trigger below opens a run when a poll's
-- status becomes 'open' and closes it when the status leaves 'open', so the
-- statement you already use keeps working:
--
--   UPDATE polls SET status = 'open'   WHERE id = '<id>';   -- starts a new run
--   UPDATE polls SET status = 'closed' WHERE id = '<id>';   -- ends it
CREATE TABLE IF NOT EXISTS poll_runs (
  id        BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  poll_id   TEXT        NOT NULL REFERENCES polls (id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ                       -- NULL while the run is live
);

-- At most one run live at a time, across every question. The expression is
-- constant for matching rows, so the index permits exactly one of them.
CREATE UNIQUE INDEX IF NOT EXISTS idx_poll_runs_single_open
  ON poll_runs ((closed_at IS NULL)) WHERE closed_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_poll_runs_poll ON poll_runs (poll_id, opened_at DESC);

-- Keeps runs in step with polls.status, so opening and closing stays one
-- familiar UPDATE rather than new syntax to remember during an event.
CREATE OR REPLACE FUNCTION poll_status_sync() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'open' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'open') THEN
    INSERT INTO poll_runs (poll_id) VALUES (NEW.id);
  ELSIF NEW.status <> 'open' AND TG_OP = 'UPDATE' AND OLD.status = 'open' THEN
    UPDATE poll_runs SET closed_at = now() WHERE poll_id = NEW.id AND closed_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_poll_status_sync ON polls;
CREATE TRIGGER trg_poll_status_sync
  AFTER INSERT OR UPDATE OF status ON polls
  FOR EACH ROW EXECUTE FUNCTION poll_status_sync();

-- ---------------------------------------------------------------------------
-- Votes
-- ---------------------------------------------------------------------------
-- One vote per respondent per RUN, enforced by the primary key. Keyed on the
-- run rather than the poll on purpose: the same person answering the same
-- question in a later run is a new row, not a rejected duplicate.
--
-- Within a run the rule is only as strong as the cookie holding the token:
-- clearing cookies yields a new token and therefore another vote, which is the
-- agreed behaviour.
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
  run_id     BIGINT      NOT NULL REFERENCES poll_runs (id) ON DELETE CASCADE,
  poll_id    TEXT        NOT NULL REFERENCES polls (id) ON DELETE CASCADE,
  token      TEXT        NOT NULL REFERENCES poll_respondents (token),
  option_id  TEXT        NOT NULL,
  company    TEXT        NOT NULL DEFAULT '',
  phone      TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (run_id, token)
);

-- Upgrades from before runs existed.
ALTER TABLE poll_votes ADD COLUMN IF NOT EXISTS company TEXT NOT NULL DEFAULT '';
ALTER TABLE poll_votes ADD COLUMN IF NOT EXISTS run_id BIGINT REFERENCES poll_runs (id) ON DELETE CASCADE;

-- Votes cast before runs existed belong to one implied, already-finished run
-- per question. Give them one rather than dropping them on the floor.
DO $$
DECLARE orphan RECORD; new_run BIGINT;
BEGIN
  FOR orphan IN SELECT DISTINCT poll_id FROM poll_votes WHERE run_id IS NULL LOOP
    INSERT INTO poll_runs (poll_id, opened_at, closed_at)
      VALUES (orphan.poll_id, now(), now()) RETURNING id INTO new_run;
    UPDATE poll_votes SET run_id = new_run WHERE poll_id = orphan.poll_id AND run_id IS NULL;
  END LOOP;
END $$;

-- Swap the primary key from (poll_id, token) to (run_id, token). A fresh
-- install already has the right one, so both halves are conditional.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'poll_votes'::regclass AND contype = 'p'
      AND pg_get_constraintdef(oid) LIKE '%(poll_id, token)%'
  ) THEN
    ALTER TABLE poll_votes DROP CONSTRAINT poll_votes_pkey;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conrelid = 'poll_votes'::regclass AND contype = 'p'
  ) THEN
    ALTER TABLE poll_votes ALTER COLUMN run_id SET NOT NULL;
    ALTER TABLE poll_votes ADD PRIMARY KEY (run_id, token);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_poll_votes_tally ON poll_votes (run_id, option_id);

-- ---------------------------------------------------------------------------
-- Who answered what
-- ---------------------------------------------------------------------------
-- The attribution view: one row per answer with the respondent attached and the
-- option label resolved, so reading the results needs no joins by hand.
--
--   SELECT * FROM poll_responses WHERE poll_id = 'workplace-menopause-policy';
--   SELECT * FROM poll_responses WHERE run_id = 3;   -- one run in isolation
--
-- A respondent identifies once and then answers every poll, so filtering by
-- phone shows one person's answers across all of them.
-- DROP first: CREATE OR REPLACE VIEW can only append columns, so adding run_id
-- at the front fails against an existing view. Dropping is safe, a view holds
-- no data.
DROP VIEW IF EXISTS poll_responses;
CREATE VIEW poll_responses AS
SELECT
  v.run_id,
  run.opened_at AS run_opened_at,
  run.closed_at AS run_closed_at,
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
JOIN poll_runs run      ON run.id = v.run_id
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
