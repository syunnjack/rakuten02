#!/usr/bin/env bash
# Submit homepage + sitemap URLs (and up to 50 sitemap locs) to IndexNow.
set -euo pipefail

submit() {
  local host="$1" key="$2"
  local key_loc="https://${host}/${key}.txt"
  local sitemap="https://${host}/sitemap.xml"

  local key_code
  key_code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 15 "$key_loc" || echo 000)"
  if [[ "$key_code" != "200" ]]; then
    echo "SKIP $host: key file HTTP $key_code ($key_loc)"
    return 0
  fi

  local urls=()
  urls+=("https://${host}/")
  urls+=("$sitemap")

  # Pull up to 48 additional locs from sitemap
  local locs
  locs="$(curl -fsSL --max-time 30 "$sitemap" | rg -o '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' | head -n 48 || true)"
  while IFS= read -r loc; do
    [[ -z "$loc" ]] && continue
    urls+=("$loc")
  done <<<"$locs"

  # Dedupe
  mapfile -t urls < <(printf '%s\n' "${urls[@]}" | awk '!seen[$0]++')

  local json_urls
  json_urls="$(printf '%s\n' "${urls[@]}" | python3 -c 'import json,sys; print(json.dumps([l.strip() for l in sys.stdin if l.strip()]))')"

  local payload
  payload="$(python3 - <<PY
import json
print(json.dumps({
  "host": "$host",
  "key": "$key",
  "keyLocation": "$key_loc",
  "urlList": json.loads('''$json_urls''')
}, ensure_ascii=False))
PY
)"

  local code
  code="$(curl -sS -o /tmp/indexnow-resp.txt -w '%{http_code}' -X POST 'https://api.indexnow.org/indexnow' \
    -H 'Content-Type: application/json; charset=utf-8' \
    -d "$payload" || echo 000)"
  echo "IndexNow $host -> HTTP $code (${#urls[@]} urls)"
  head -c 200 /tmp/indexnow-resp.txt; echo
}

submit "darekore.jp" "darekoreindex2026"
submit "machi-list.jp" "machilistindex2026"
submit "busselect.jp" "busselectindex2026"
# shudenhotel key is 404 until PR #34 is deployed
submit "shudenhotel.jp" "shudenhotelindex2026"
