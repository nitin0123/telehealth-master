#!/usr/bin/env bash
# Simulate N poll respondents against a deployment.
#
#   ./poll-load-test.sh https://your-preview.vercel.app 100
#
# Preview deployments sit behind Vercel Deployment Protection, which answers 401
# to anything without a Vercel session, so a script cannot reach them. Generate
# a secret under Settings -> Deployment Protection -> Protection Bypass for
# Automation and export it:
#
#   export VERCEL_BYPASS=xxxxxxxx
#
# Each simulated person does what a real one does: identify once, then vote
# once. Failures are reported rather than swallowed, which is the whole point:
# a silent run tells you nothing about whether the poll actually works.
set -uo pipefail

BASE="${1:?usage: $0 <base-url> [count] [poll-id]}"
COUNT="${2:-100}"
POLL="${3:-workplace-menopause-policy}"
BASE="${BASE%/}"

command -v shuf >/dev/null || { echo "shuf not found (brew install coreutils)"; exit 1; }

# Sent on every request when set; ignored by production, which is not protected.
# Accepts either name: VERCEL_AUTOMATION_BYPASS_SECRET is what Vercel calls it,
# VERCEL_BYPASS is shorter to type.
SECRET="${VERCEL_AUTOMATION_BYPASS_SECRET:-${VERCEL_BYPASS:-}}"
BYPASS=()
if [ -n "$SECRET" ]; then
  BYPASS=(-H "x-vercel-protection-bypass: $SECRET" -H "x-vercel-set-bypass-cookie: true")
  echo "Using Vercel protection bypass (${#SECRET} char secret)."
else
  echo "No bypass secret set. Fine for production; a protected preview will 401."
fi

# --- Preflight -------------------------------------------------------------
# Fail early and loudly rather than posting 100 requests into a 404 or a poll
# that is not open. Both are the likely reasons a run "does nothing".
echo "Checking $BASE ..."

probe=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/api/poll-identify" \
  "${BYPASS[@]}" -H 'Content-Type: application/json' -d '{}')
case "$probe" in
  400) echo "  /api/poll-identify reachable (rejected an empty body, as expected)" ;;
  404) echo "  /api/poll-identify returns 404: this deployment predates the poll. Use the newest preview URL."; exit 1 ;;
  401|403)
    echo "  $probe: behind Vercel Deployment Protection."
    echo "     Settings -> Deployment Protection -> Protection Bypass for Automation,"
    echo "     then: export VERCEL_BYPASS=<secret> and re-run."
    exit 1 ;;
  *)   echo "  unexpected $probe from /api/poll-identify"; exit 1 ;;
esac

# A closed or draft poll answers 409, so check before generating a hundred
# respondents whose votes would all be rejected.
probe_vote=$(curl -s -X POST "$BASE/api/poll-vote" "${BYPASS[@]}" -H 'Content-Type: application/json' \
  -d "{\"poll\":\"$POLL\",\"option\":\"yes\"}")
case "$probe_vote" in
  *"not accepting votes"*)
    echo "  poll '$POLL' is not open. Run:"
    echo "     UPDATE polls SET status='open' WHERE id='$POLL';"
    exit 1 ;;
  *"does not exist"*)
    echo "  poll '$POLL' does not exist in this environment's database."; exit 1 ;;
  *"before voting"*)
    echo "  poll '$POLL' is open and asking for identity, as expected" ;;
  *)
    echo "  unexpected vote probe: $probe_vote" ;;
esac

# --- Run -------------------------------------------------------------------
ok=0; failed=0
echo "Sending $COUNT respondents to $POLL ..."

for i in $(seq 1 "$COUNT"); do
  # 10 digits, unique per run index. The API stores it as +91XXXXXXXXXX.
  phone=$(printf '9876%06d' "$i")

  # -D captures the response headers so the Set-Cookie token can be read.
  # No -c: a cookie jar on stdout would mix into the response body.
  headers=$(mktemp)
  body=$(curl -s -D "$headers" -X POST "$BASE/api/poll-identify" \
    "${BYPASS[@]}" -H 'Content-Type: application/json' \
    -d "{\"company\":\"Test Co $i\",\"phone\":\"$phone\"}")

  token=$(grep -i '^set-cookie: *rw_poll_id=' "$headers" | head -1 | sed -E 's/.*rw_poll_id=([^;]*).*/\1/')
  rm -f "$headers"

  if [ -z "$token" ]; then
    echo "  [$i] identify failed: $body"
    failed=$((failed + 1))
    continue
  fi

  opt=$(shuf -e yes no not-sure -n 1)
  vote=$(curl -s -X POST "$BASE/api/poll-vote" "${BYPASS[@]}" \
    -H 'Content-Type: application/json' -H "Cookie: rw_poll_id=$token" \
    -d "{\"poll\":\"$POLL\",\"option\":\"$opt\"}")

  case "$vote" in
    *'"ok":true'*) ok=$((ok + 1)); printf '\r  %d/%d voted' "$ok" "$COUNT" ;;
    *) echo "  [$i] vote failed: $vote"; failed=$((failed + 1)) ;;
  esac

  # Paced, so the results page shows arrivals rather than one lump. Drop this
  # to hammer the endpoints instead.
  sleep 1
done

echo
echo "done: $ok voted, $failed failed"
echo
echo "Clean up afterwards:"
echo "  DELETE FROM poll_votes       WHERE phone LIKE '+919876%';"
echo "  DELETE FROM poll_respondents WHERE phone LIKE '+919876%';"
