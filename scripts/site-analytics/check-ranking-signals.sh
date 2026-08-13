#!/usr/bin/env bash
# Probe live ColorfulBOX ranking / DTI hosts for basic GSC signals.
# Exit 1 if any CRITICAL (fake GA4/GSC or homepage fetch fail).
set -euo pipefail

sites=(
  "sosolu.pro|https://sosolu.pro/"
  "sosolu.tokyo|https://sosolu.tokyo/"
  "sosoru.tokyo|https://sosoru.tokyo/"
  "sosolu.net|https://sosolu.net/"
  "sosolu.xyz|https://sosolu.xyz/"
  "sosoru.org|https://sosoru.org/"
  "sosoru.asia|https://sosoru.asia/"
)

critical=0
warn=0

is_placeholder() {
  local v="$1"
  case "$v" in
    *HTMLタグ*|*content値*|GA4測定ID|XXXX*|YOUR_*|*測定ID*) return 0 ;;
  esac
  if printf '%s' "$v" | rg -q '[[:space:]]|[ぁ-んァ-ン一-龥]'; then
    return 0
  fi
  return 1
}

printf '%-16s %-6s %-8s %-8s %-10s %-8s %s\n' "SITE" "HTTP" "CANON" "GA4" "GSC" "SITEMAP" "NOTES"
printf '%s\n' "--------------------------------------------------------------------------------"

for entry in "${sites[@]}"; do
  IFS='|' read -r name url <<<"$entry"
  notes=()
  html="$(curl -fsSL --max-time 20 "$url" || true)"
  if [[ -z "$html" ]]; then
    printf '%-16s %-6s %-8s %-8s %-10s %-8s %s\n' "$name" "FAIL" "-" "-" "-" "-" "homepage fetch failed"
    critical=$((critical + 1))
    continue
  fi

  http_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$url" || echo 000)"
  canon="$(printf '%s' "$html" | rg -o 'rel="canonical" href="[^"]+"' | head -1 | sed -E 's/.*href="([^"]+)".*/\1/' || true)"
  ga4="$(printf '%s' "$html" | rg -o 'gtag/js\?id=[A-Za-z0-9_-]+' | head -1 | sed 's/.*id=//' || true)"
  gsc="$(printf '%s' "$html" | rg -o 'google-site-verification" content="[^"]+"' | head -1 | sed -E 's/.*content="([^"]+)".*/\1/' || true)"

  canon_ok="Y"
  if [[ -z "$canon" ]]; then
    canon_ok="MISS"; notes+=("no-canonical"); warn=$((warn + 1))
  elif [[ "$canon" == http://* ]]; then
    canon_ok="HTTP"; notes+=("canonical-http"); critical=$((critical + 1))
  fi

  # Prefer https://host/ trailing slash; flag missing slash as warn only
  if [[ -n "$canon" && "$canon" != */ ]]; then
    notes+=("canonical-no-slash"); warn=$((warn + 1))
  fi

  ga4_ok="Y"
  if [[ -z "$ga4" ]]; then
    ga4_ok="MISS"; notes+=("no-ga4"); warn=$((warn + 1))
  elif [[ ! "$ga4" =~ ^G-[A-Z0-9]+$ ]]; then
    ga4_ok="FAKE"; notes+=("ga4-placeholder"); critical=$((critical + 1))
  fi

  gsc_ok="Y"
  if [[ -z "$gsc" ]]; then
    gsc_ok="MISS"; notes+=("no-gsc"); warn=$((warn + 1))
  elif is_placeholder "$gsc" || [[ ${#gsc} -lt 10 ]]; then
    gsc_ok="FAKE"; notes+=("gsc-placeholder"); critical=$((critical + 1))
  fi

  map_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "${url%/}/sitemap.xml" || echo 000)"
  map_ok="Y"
  if [[ "$map_code" != "200" ]]; then
    map_ok="MISS"; notes+=("sitemap-$map_code"); warn=$((warn + 1))
  fi

  note_str="ok"
  [[ ${#notes[@]} -gt 0 ]] && note_str="$(IFS=','; echo "${notes[*]}")"
  printf '%-16s %-6s %-8s %-8s %-10s %-8s %s\n' "$name" "$http_code" "$canon_ok" "$ga4_ok" "$gsc_ok" "$map_ok" "$note_str"
done

echo
echo "critical=$critical warn=$warn"
[[ "$critical" -eq 0 ]]
