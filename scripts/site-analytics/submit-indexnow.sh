#!/usr/bin/env bash
# Submit homepage + sitemap URLs (and up to 50 sitemap locs) to IndexNow.
# Posts to api.indexnow.org (Bing + partners) and yandex.com/indexnow.
# Bing may return 403 UserForbiddedToAccessSite until the domain is verified in
# Bing Webmaster Tools (or Bingbot organically binds the key). That is not a
# broken key file when GET /{key}.txt returns 200 with the key body.
set -euo pipefail

ENDPOINTS=(
  "https://api.indexnow.org/indexnow"
  "https://yandex.com/indexnow"
)

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

  local locs
  locs="$(curl -fsSL --max-time 30 "$sitemap" | rg -o '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' | head -n 48 || true)"
  while IFS= read -r loc; do
    [[ -z "$loc" ]] && continue
    urls+=("$loc")
  done <<<"$locs"

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

  local any_ok=0
  local ep code
  for ep in "${ENDPOINTS[@]}"; do
    code="$(curl -sS -o /tmp/indexnow-resp.txt -w '%{http_code}' -X POST "$ep" \
      -H 'Content-Type: application/json; charset=utf-8' \
      -d "$payload" || echo 000)"
    local short="${ep#https://}"
    short="${short%%/*}"
    echo "IndexNow $host via $short -> HTTP $code (${#urls[@]} urls)"
    if [[ "$code" == "200" || "$code" == "202" ]]; then
      any_ok=1
    elif [[ "$code" == "403" ]] && rg -q 'UserForbiddedToAccessSite' /tmp/indexnow-resp.txt 2>/dev/null; then
      echo "  note: Bing key binding pending — verify host in Bing Webmaster Tools, then re-run"
      head -c 200 /tmp/indexnow-resp.txt; echo
    else
      head -c 200 /tmp/indexnow-resp.txt; echo
    fi
  done

  if [[ "$any_ok" -eq 0 ]]; then
    echo "WARN $host: no IndexNow endpoint accepted the payload"
  fi
}

submit "darekore.jp" "darekoreindex2026"
submit "machi-list.jp" "machilistindex2026"
submit "busselect.jp" "busselectindex2026"
submit "shudenhotel.jp" "shudenhotelindex2026"
submit "goalpilot.jp" "goalpilotindex2026"
