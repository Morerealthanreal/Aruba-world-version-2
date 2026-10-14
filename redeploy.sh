#!/bin/sh
# Rebuild and redeploy Aruba World to the permanent Surge URL (non-interactive).
set -e
(set -o pipefail) 2>/dev/null && set -o pipefail
cd "$(dirname "$0")"
CREDS=/workspace/.hosting_creds
SURGE=/workspace/.surge-cli/node_modules/.bin/surge
[ -x "$SURGE" ] || npm i surge --prefix /workspace/.surge-cli >/dev/null
export SURGE_LOGIN=$(sed -n 's/^email=//p' "$CREDS")
export SURGE_TOKEN=$(sed -n 's/^token=//p' "$CREDS")
DOMAIN=$(sed -n 's/^domain=//p' "$CREDS")
sh make-deploy.sh
echo "$DOMAIN" > deploy/CNAME
"$SURGE" ./deploy "$DOMAIN"
curl -fsS -o /dev/null -w "check: %{http_code}\n" "https://$DOMAIN/?q=low"
echo "Live: https://$DOMAIN/?q=low"
