#!/usr/bin/env bash
# Apply every SQL file in db/*.sql to a Postgres database.
#
# Usage:
#   db/migrate.sh "<POSTGRES_CONNECTION_STRING>"
#
# The migrations use CREATE TABLE IF NOT EXISTS, so this is idempotent and
# safe to run repeatedly. Run it once per database (preview and production).
set -euo pipefail

URL="${1:?Usage: db/migrate.sh <postgres-connection-string>}"
DIR="$(cd "$(dirname "$0")" && pwd)"

for f in "$DIR"/*.sql; do
  echo "→ applying $(basename "$f")"
  psql "$URL" -f "$f"
done

echo "✓ all migrations applied"
