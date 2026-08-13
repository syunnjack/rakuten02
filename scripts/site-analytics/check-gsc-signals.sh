#!/usr/bin/env bash
# GSC / SEO signal checker for portfolio properties.
# Exit 1 if any CRITICAL finding is present.
set -euo pipefail

sites=(
  "shudenhotel.jp|https://shudenhotel.jp/"
  "darekore.jp|https://darekore.jp/"
  "goalpilot.jp|https://goalpilot.jp/"
  "machi-list.jp|https://machi-list.jp/"
  "busselect.jp|https://busselect.jp/"
)

critical=0
warn=0

is_placeholder() {
  local v="$1"
  case "$v" in
    *HTMLタグ*|*content値*|GA4測定ID|XXXX*|YOUR_*|*測定ID*) return 0 ;;
  esac
  # Reject obvious non-token Japanese / spaces
  if printf '%s' "$v" | rg -q '[[:space:]]|[ぁ-んァ-ン一-龥]'; then
    return 0
  fi
  return 1
}

printf '%-18s %-6s %-8s %-8s %-10s %-8s %s\n' "SITE" "HTTP" "CANON" "GA4" "GSC" "SITEMAP" "NOTES"
printf '%s\n' "--------------------------------------------------------------------------------"

for entry in "${sites[@]}"; do
  IFS='|' read -r name url <<<"$entry"
  notes=()
  html="$(curl -fsSL --max-time 20 "$url" || true)"
  if [[ -z "$html" ]]; then
    printf '%-18s %-6s %-8s %-8s %-10s %-8s %s\n' "$name" "FAIL" "-" "-" "-" "-" "homepage fetch failed"
    critical=$((critical + 1))
    continue
  fi

  http_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$url" || echo 000)"
  canon="$(printf '%s' "$html" | rg -o 'rel="canonical" href="[^"]+"' | head -1 | sed -E 's/.*href="([^"]+)".*/\1/' || true)"
  if [[ -z "$canon" ]]; then
    # Next.js sometimes emits escaped JSON for link tags
    canon="$(printf '%s' "$html" | rg -o '\"rel\":\"canonical\",\"href\":\"[^\"]+\"' | head -1 | sed -E 's/.*"href":"([^"]+)".*/\1/' || true)"
  fi
  if [[ -z "$canon" ]]; then
    # Soft fallback used only for reporting when Next omits link[rel=canonical]
    canon="$(printf '%s' "$html" | rg -o 'property="og:url" content="https://[^"]+"' | head -1 | sed -E 's/.*content="([^"]+)".*/\1/' || true)"
    if [[ -n "$canon" ]]; then
      notes+=("canonical-via-ogurl")
      warn=$((warn + 1))
    fi
  fi
  ga4="$(printf '%s' "$html" | rg -o 'gtag/js\?id=[A-Za-z0-9_-]+' | head -1 | sed 's/.*id=//' || true)"
  gsc="$(printf '%s' "$html" | rg -o 'google-site-verification" content="[^"]+"' | head -1 | sed -E 's/.*content="([^"]+)".*/\1/' || true)"
  if [[ -z "$gsc" ]]; then
    gsc="$(printf '%s' "$html" | rg -o 'google-site-verification\",\"content\":\"[^\"]+\"' | head -1 | sed -E 's/.*"content":"([^"]+)".*/\1/' || true)"
  fi

  canon_ok="Y"
  if [[ -z "$canon" ]]; then
    canon_ok="MISS"
    notes+=("no-canonical")
    warn=$((warn + 1))
  elif [[ "$canon" == http://* ]]; then
    canon_ok="HTTP"
    notes+=("canonical-http")
    critical=$((critical + 1))
  elif [[ "$canon" != https://* ]]; then
    canon_ok="BAD"
    notes+=("canonical-scheme")
    critical=$((critical + 1))
  fi

  ga4_ok="Y"
  if [[ -z "$ga4" ]]; then
    ga4_ok="MISS"
    notes+=("no-ga4")
    warn=$((warn + 1))
  elif [[ ! "$ga4" =~ ^G-[A-Z0-9]+$ ]]; then
    ga4_ok="FAKE"
    notes+=("ga4-placeholder")
    critical=$((critical + 1))
  fi

  gsc_ok="Y"
  if [[ -z "$gsc" ]]; then
    gsc_ok="MISS"
    notes+=("no-gsc")
    warn=$((warn + 1))
  elif is_placeholder "$gsc" || [[ ${#gsc} -lt 10 ]]; then
    gsc_ok="FAKE"
    notes+=("gsc-placeholder")
    critical=$((critical + 1))
  fi

  map_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "${url%/}/sitemap.xml" || echo 000)"
  map_ok="Y"
  if [[ "$map_code" != "200" ]]; then
    map_ok="MISS"
    notes+=("sitemap-$map_code")
    critical=$((critical + 1))
  else
    if [[ "$name" == "shudenhotel.jp" ]]; then
      sm="$(curl -fsSL --max-time 15 "${url%/}/sitemap.xml" || true)"
      if printf '%s' "$sm" | rg -q '<loc>http://shudenhotel\.jp'; then
        notes+=("sitemap-http")
        critical=$((critical + 1))
        map_ok="HTTP"
      fi
      if printf '%s' "$sm" | rg -q '<loc>[^<]*search\?'; then
        notes+=("sitemap-has-search")
        warn=$((warn + 1))
      fi
    fi
  fi

  if printf '%s' "$html" | rg -q 'GA4測定ID|Search Console HTMLタグのcontent値|YOUR_VC_SID'; then
    notes+=("placeholder-text")
    critical=$((critical + 1))
  fi

  # Thin / duplicated titles that need patch deploy
  title="$(printf '%s' "$html" | rg -o '<title>[^<]*</title>' | head -1 | sed -E 's#</?title>##g' || true)"
  if [[ -z "$title" ]]; then
    title="$(printf '%s' "$html" | rg -o '\"children\":\"[^\"]+\"' | head -1 || true)"
  fi
  if [[ "$name" == "darekore.jp" && "$title" == "この子だれ？" ]]; then
    notes+=("thin-title")
    warn=$((warn + 1))
  fi
  if [[ "$name" == "busselect.jp" && "$title" == "NOLU |"*"| NOLU" ]]; then
    notes+=("dup-title")
    warn=$((warn + 1))
  fi
  if [[ "$name" == "busselect.jp" ]]; then
    search_robots="$(curl -fsSL --max-time 15 "${url%/}/search?from=tokyo&to=osaka" 2>/dev/null \
      | rg -o 'name=\"robots\" content=\"[^\"]+\"|\"name\":\"robots\",\"content\":\"[^\"]+\"' | head -1 || true)"
    if printf '%s' "$search_robots" | rg -q 'index, follow'; then
      notes+=("search-still-indexable")
      warn=$((warn + 1))
    fi
  fi

  if [[ ${#notes[@]} -eq 0 ]]; then
    note_str="ok"
  else
    note_str="$(IFS=','; echo "${notes[*]}")"
  fi
  printf '%-18s %-6s %-8s %-8s %-10s %-8s %s\n' "$name" "$http_code" "$canon_ok" "$ga4_ok" "$gsc_ok" "$map_ok" "$note_str"
done

echo
echo "critical=$critical warn=$warn"
if [[ "$critical" -gt 0 ]]; then
  exit 1
fi
