#!/usr/bin/env bash
# Simulate N poll respondents against a deployment.
#
#   ./scripts/poll-load-test.sh                  newest preview, 100 people
#   ./scripts/poll-load-test.sh 500              newest preview, 500 people
#   ./scripts/poll-load-test.sh https://... 500  a specific deployment
#
# With no URL it asks the Vercel CLI for the newest Preview deployment, so a
# stale one cannot be tested by accident. That is the easy mistake to make: a
# preview URL changes on every push, and the old one still answers.
#
# PACE is the seconds between people (default 1). A real room answers over a
# couple of minutes, so PACE=0.2 with 500 is closer to the live shape than the
# default, which would take over eight minutes:
#
#   PACE=0.2 ./scripts/poll-load-test.sh 500
#
# Preview deployments sit behind Vercel Deployment Protection, which answers 401
# to anything without a Vercel session. Generate a secret under Settings ->
# Deployment Protection -> Protection Bypass for Automation and export it:
#
#   export VERCEL_AUTOMATION_BYPASS_SECRET=xxxxxxxx
#
# Each simulated person does what a real one does: identify once, then vote
# once. Failures are reported rather than swallowed, which is the whole point:
# a silent run tells you nothing about whether the poll actually works.
set -uo pipefail

# The first argument is a URL only if it looks like one; otherwise it is the
# count, so `... 500` does the obvious thing without naming a deployment.
if [[ "${1:-}" == http* ]]; then
  BASE="$1"; COUNT="${2:-100}"; POLL="${3:-workplace-menopause-policy}"
else
  BASE=""; COUNT="${1:-100}"; POLL="${2:-workplace-menopause-policy}"
fi
PACE="${PACE:-1}"

command -v shuf >/dev/null || { echo "shuf not found (brew install coreutils)"; exit 1; }

# --- Target ----------------------------------------------------------------
if [ -z "$BASE" ]; then
  command -v vercel >/dev/null || {
    echo "No URL given and the Vercel CLI is not installed."
    echo "Pass one explicitly: $0 https://your-preview.vercel.app $COUNT"
    exit 1
  }
  echo "Finding the newest Preview deployment..."
  # The first URL on the first row marked Preview. Production rows are skipped
  # deliberately: a load test must never be pointed at the live site.
  #
  # 2>&1 is required, not sloppiness. When its output is piped, `vercel ls`
  # writes bare URLs to stdout and the table carrying the Environment column to
  # stderr, so reading stdout alone gives no way to tell Preview from
  # Production and would happily return the live deployment.
  BASE=$(vercel ls --yes 2>&1 |
    awk '/[[:space:]]Preview[[:space:]]/ { for (i = 1; i <= NF; i++) if ($i ~ /^https:\/\//) { print $i; exit } }')
  [ -n "$BASE" ] || {
    echo "  could not read a Preview URL from 'vercel ls'. Pass one explicitly."
    exit 1
  }
  echo "  $BASE"
fi
BASE="${BASE%/}"

# Sent on every request when set; ignored by production, which is not protected.
# Accepts either name: VERCEL_AUTOMATION_BYPASS_SECRET is Vercel's own, and
# VERCEL_BYPASS is shorter to type.
SECRET="${VERCEL_AUTOMATION_BYPASS_SECRET:-${VERCEL_BYPASS:-}}"

# Seeded with a real header rather than declared empty. macOS ships bash 3.2,
# where `set -u` treats "${ARR[@]}" on an empty array as an unbound variable and
# aborts. Keeping one element avoids that without the unreadable
# ${ARR[@]+"${ARR[@]}"} guard, and a user-agent is genuinely useful: it makes
# load-test traffic obvious in the logs afterwards.
HDRS=(-H "user-agent: resetwell-poll-load-test" -H "Content-Type: application/json")
if [ -n "$SECRET" ]; then
  HDRS+=(-H "x-vercel-protection-bypass: $SECRET" -H "x-vercel-set-bypass-cookie: true")
  echo "Using Vercel protection bypass (${#SECRET} char secret)."
else
  echo "No bypass secret set. Fine for production; a protected preview will 401."
fi

# --- Preflight -------------------------------------------------------------
# Fail early and loudly rather than posting hundreds of requests into a 404, a
# login wall or a closed poll. Those are the three reasons a run does nothing.
echo "Checking $BASE ..."

probe=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/poll-identify" \
  "${HDRS[@]}" -d '{}')
case "$probe" in
  400) echo "  /api/poll-identify reachable (rejected an empty body, as expected)" ;;
  404)
    echo "  404: this deployment predates the poll. Re-run with no URL to pick the newest."
    exit 1 ;;
  401|403)
    echo "  $probe: behind Vercel Deployment Protection."
    echo "     Settings -> Deployment Protection -> Protection Bypass for Automation,"
    echo "     then: export VERCEL_AUTOMATION_BYPASS_SECRET=<secret> and re-run."
    exit 1 ;;
  *) echo "  unexpected $probe from /api/poll-identify"; exit 1 ;;
esac

# A draft or closed poll answers 409, so check before generating respondents
# whose votes would all be rejected.
probe_vote=$(curl -s -X POST "$BASE/api/poll-vote" "${HDRS[@]}" \
  -d "{\"poll\":\"$POLL\",\"option\":\"yes\"}")
case "$probe_vote" in
  *"not accepting votes"*)
    echo "  poll '$POLL' is not open. Run against this environment's database:"
    echo "     UPDATE polls SET status='open' WHERE id='$POLL';"
    exit 1 ;;
  *"does not exist"*)
    echo "  poll '$POLL' does not exist in this environment's database."
    echo "     Run: npm run db:push"
    exit 1 ;;
  *"before voting"*)
    echo "  poll '$POLL' is open and asking for identity, as expected" ;;
  *)
    echo "  unexpected vote probe: $probe_vote" ;;
esac

# --- Run -------------------------------------------------------------------
ok=0
failed=0
# Rough estimate: the pace plus a round trip for the two requests.
mins=$(awk -v c="$COUNT" -v p="$PACE" 'BEGIN { printf "%.0f", (c * (p + 0.6)) / 60 }')
echo "Sending $COUNT respondents to $POLL, ${PACE}s apart (roughly ${mins}m) ..."

for i in $(seq 1 "$COUNT"); do
  # 10 digits, unique per index. The API stores it as +91XXXXXXXXXX.
  phone=$(printf '9876%06d' "$i")

  # -D captures the response headers so the Set-Cookie token can be read. No -c:
  # a cookie jar on stdout would mix into the response body.
  headers=$(mktemp)
  body=$(curl -s -D "$headers" -X POST "$BASE/api/poll-identify" \
    "${HDRS[@]}" \
    -d "{\"company\":\"Test Co $i\",\"phone\":\"$phone\"}")

  token=$(grep -i '^set-cookie: *rw_poll_id=' "$headers" | head -1 | sed -E 's/.*rw_poll_id=([^;]*).*/\1/')
  rm -f "$headers"

  if [ -z "$token" ]; then
    echo "  [$i] identify failed: $body"
    failed=$((failed + 1))
    continue
  fi

  opt=$(shuf -e yes no not-sure -n 1)
  vote=$(curl -s -X POST "$BASE/api/poll-vote" "${HDRS[@]}" \
    -H "Cookie: rw_poll_id=$token" \
    -d "{\"poll\":\"$POLL\",\"option\":\"$opt\"}")

  case "$vote" in
    *'"ok":true'*) ok=$((ok + 1)); printf '\r  %d/%d voted' "$ok" "$COUNT" ;;
    *) echo "  [$i] vote failed: $vote"; failed=$((failed + 1)) ;;
  esac

  # Paced so the results board shows arrivals rather than one lump. PACE=0 to
  # hammer the endpoints instead.
  [ "$PACE" != "0" ] && sleep "$PACE"
done

echo
echo "done: $ok voted, $failed failed"
echo
echo "Clean up afterwards:"
echo "  DELETE FROM poll_votes       WHERE phone LIKE '+919876%';"
echo "  DELETE FROM poll_respondents WHERE phone LIKE '+919876%';"
