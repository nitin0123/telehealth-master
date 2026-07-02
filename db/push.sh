#!/usr/bin/env bash
# Push the db/*.sql schema to the preview or production database, reading the
# connection string from the matching .env file so you never paste URLs.
#
#   npm run db:push        -> preview DB   (.env.local: POSTGRES_URL or DATABASE_URL)
#   npm run db:push:prod   -> production   (.env.prod:  PROD_DATABASE_URL)
#
# Idempotent: the SQL uses CREATE TABLE IF NOT EXISTS, so re-running is safe.
# Note this creates missing tables but does NOT alter existing ones — for a
# schema change, add an idempotent `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
# to the relevant db/*.sql first, then push.
set -euo pipefail

ENVIRONMENT="${1:-preview}"
DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$DIR/.." && pwd)"

# Read KEY=VALUE from an env file, stripping optional surrounding quotes.
read_env() {
  local file="$1" key="$2"
  [ -f "$file" ] || { echo "✗ $file not found" >&2; return 1; }
  sed -n "s/^${key}=//p" "$file" | tail -1 | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'\$//"
}

case "$ENVIRONMENT" in
  prod|production)
    URL="$(read_env "$ROOT/.env.prod" PROD_DATABASE_URL)"
    LABEL="PRODUCTION"
    ;;
  preview|local|dev)
    URL="$(read_env "$ROOT/.env.local" POSTGRES_URL || true)"
    [ -n "$URL" ] || URL="$(read_env "$ROOT/.env.local" DATABASE_URL || true)"
    LABEL="preview"
    ;;
  *)
    echo "Usage: db/push.sh [preview|prod]" >&2; exit 1;;
esac

if [ -z "${URL:-}" ]; then
  echo "✗ No connection string found for the $LABEL database." >&2
  exit 1
fi

echo "→ pushing schema to the $LABEL database"
"$DIR/migrate.sh" "$URL"
