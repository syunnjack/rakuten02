#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CONFIG="$ROOT/scripts/site-analytics/sites.config.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

site_id="${1:-}"
if [[ -z "$site_id" ]]; then
  echo "Usage: $0 <site-id>"
  echo
  jq -r '.[] | "- \(.id): \(.domain) [\(.status)]"' "$CONFIG"
  exit 1
fi

entry="$(jq -c --arg id "$site_id" '.[] | select(.id == $id)' "$CONFIG")"
if [[ -z "$entry" ]]; then
  echo "Unknown site id: $site_id"
  exit 1
fi

repo="$(jq -r '.repo' <<<"$entry")"
patch="$(jq -r '.patch // empty' <<<"$entry")"
domain="$(jq -r '.domain' <<<"$entry")"
status="$(jq -r '.status' <<<"$entry")"

echo "Site: $site_id"
echo "Repo: $repo"
echo "Domain: $domain"
echo "Status: $status"
echo

if [[ "$status" == "completed" ]]; then
  echo "Already completed."
  exit 0
fi

if [[ -n "$patch" ]]; then
  patch_path="$ROOT/$patch"
  echo "1. Clone repo and apply patch:"
  echo "   git clone https://github.com/$repo.git"
  echo "   cd \"\$(basename "$repo")\""
  echo "   git am \"$patch_path\""
  echo
fi

echo "2. Set GitHub Secrets on $repo:"
jq -r '.secrets[]? | "   - \(.)"' <<<"$entry"
echo

indexnow_key="$(jq -r '.indexNowKey // empty' <<<"$entry")"
if [[ -n "$indexnow_key" ]]; then
  echo "3. IndexNow key default: $indexnow_key"
  echo "   Public file: ${domain%/}/$indexnow_key.txt"
  echo
fi

echo "4. Search Console (manual):"
echo "   - URL prefix: $domain"
echo "   - Verification: HTML tag"
echo "   - Sitemap: ${domain%/}/sitemap.xml"
echo

dns_note="$(jq -r '.dnsNote // empty' <<<"$entry")"
if [[ -n "$dns_note" ]]; then
  echo "Note: $dns_note"
fi
