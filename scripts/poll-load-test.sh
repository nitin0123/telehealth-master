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
# JOBS runs that many people at once (default 1). Sequentially each person costs
# two round trips, roughly a second, so 500 takes ten minutes however small PACE
# is; a real room answers in two or three. Parallel workers are the only way to
# reproduce that shape:
#
#   JOBS=8 PACE=0 ./scripts/poll-load-test.sh 500
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
# Concurrent workers. Past about 10 every request from this one IP is queueing
# behind the same rate_limits row in Postgres, so you start measuring lock
# contention rather than the poll.
JOBS="${JOBS:-1}"

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
# Workers run concurrently, each taking every JOBS-th index, so the requests
# overlap the way a room does. Sequential runs top out near one person per
# second because each does two round trips, which cannot reproduce 500 people
# answering over two minutes however small PACE gets.
#
# Counters cannot be shared: each worker is a subshell, so its variables die
# with it. Each writes its own tally to a file and the parent sums them.
RESULTS=$(mktemp -d)
trap 'rm -rf "$RESULTS"' EXIT

person() {
  local i="$1"
  # 10 digits, unique per index. The API stores it as +91XXXXXXXXXX.
  local phone; phone=$(printf '9876%06d' "$i")

  # -D captures the response headers so the Set-Cookie token can be read. No -c:
  # a cookie jar on stdout would mix into the response body.
  local headers; headers=$(mktemp)
  local body; body=$(curl -s -D "$headers" -X POST "$BASE/api/poll-identify" \
    "${HDRS[@]}" \
    -d "{\"name\":\"Test Person $i\",\"company\":\"Test Co $i\",\"phone\":\"$phone\"}")

  local token; token=$(grep -i '^set-cookie: *rw_poll_id=' "$headers" | head -1 | sed -E 's/.*rw_poll_id=([^;]*).*/\1/')
  rm -f "$headers"

  if [ -z "$token" ]; then
    echo "  [$i] identify failed: $body"
    return 1
  fi

  local opt; opt=$(shuf -e yes no not-sure -n 1)
  local vote; vote=$(curl -s -X POST "$BASE/api/poll-vote" "${HDRS[@]}" \
    -H "Cookie: rw_poll_id=$token" \
    -d "{\"poll\":\"$POLL\",\"option\":\"$opt\"}")

  case "$vote" in
    *'"ok":true'*) return 0 ;;
    *) echo "  [$i] vote failed: $vote"; return 1 ;;
  esac
}

# Each worker walks its own stride through the range, so the load stays even
# even when some requests are slower than others.
worker() {
  local offset="$1" ok=0 failed=0 i
  for ((i = offset; i <= COUNT; i += JOBS)); do
    if person "$i"; then ok=$((ok + 1)); else failed=$((failed + 1)); fi
    [ "$PACE" != "0" ] && sleep "$PACE"
  done
  echo "$ok $failed" > "$RESULTS/$offset"
}

# Two round trips per person, roughly 0.6s, divided across the workers.
mins=$(awk -v c="$COUNT" -v p="$PACE" -v j="$JOBS" 'BEGIN { printf "%.1f", (c * (p + 0.6)) / j / 60 }')
echo "Sending $COUNT respondents to $POLL: $JOBS in parallel, ${PACE}s apart (roughly ${mins}m) ..."

started=$(date +%s)
for ((w = 1; w <= JOBS; w++)); do worker "$w" & done
wait

ok=0; failed=0
for f in "$RESULTS"/*; do
  read -r a b < "$f"
  ok=$((ok + a)); failed=$((failed + b))
done
took=$(( $(date +%s) - started ))

echo
echo "done in ${took}s: $ok voted, $failed failed"
[ "$ok" -gt 0 ] && echo "  ~$(awk -v o="$ok" -v t="$took" 'BEGIN { printf "%.1f", (t > 0 ? o / t : o) }') votes/second"
echo
echo "Clean up afterwards:"
echo "  DELETE FROM poll_votes       WHERE phone LIKE '+919876%';"
echo "  DELETE FROM poll_respondents WHERE phone LIKE '+919876%';"
