#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$SCRIPT_DIR/booth.config.json"
README_SNIPPET="$SCRIPT_DIR/README-SNIPPET.md"
FOOTER_SNIPPET="$SCRIPT_DIR/footer-snippet.html"

if [[ ! -d "$ROOT" ]]; then
  echo "Directory not found: $ROOT"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

shop_url="$(jq -r '.shopUrl' "$CONFIG")"
readme_heading="$(jq -r '.readmeHeading' "$CONFIG")"
readme_marker="$(jq -r '.readmeMarker' "$CONFIG")"
html_marker="$(jq -r '.htmlMarker' "$CONFIG")"

changed=0

apply_readme() {
  local readme=""
  for candidate in README.md readme.md Readme.md; do
    if [[ -f "$ROOT/$candidate" ]]; then
      readme="$ROOT/$candidate"
      break
    fi
  done

  if [[ -z "$readme" ]]; then
    readme="$ROOT/README.md"
    if [[ ! -f "$readme" ]]; then
      printf '# %s\n\n' "$(basename "$ROOT")" >"$readme"
    fi
  fi

  if grep -qF "$readme_marker" "$readme" 2>/dev/null || grep -qF "$readme_heading" "$readme" 2>/dev/null; then
    return 0
  fi

  printf '\n' >>"$readme"
  cat "$README_SNIPPET" >>"$readme"
  echo "  + README: $(basename "$readme")"
  changed=1
}

inject_html_footer() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    return 0
  fi
  if grep -qF "$html_marker" "$file" 2>/dev/null; then
    return 0
  fi
  if ! grep -qi '</body>' "$file"; then
    return 0
  fi

  local tmp
  tmp="$(mktemp)"
  awk -v snippet="$(cat "$FOOTER_SNIPPET")" '
    BEGIN { inserted = 0 }
    /<\/body>/ && !inserted {
      print snippet
      inserted = 1
    }
    { print }
  ' "$file" >"$tmp"
  mv "$tmp" "$file"
  echo "  + HTML footer: $file"
  changed=1
}

apply_readme

while IFS= read -r html_file; do
  inject_html_footer "$html_file"
done < <(find "$ROOT" -maxdepth 3 -type f \( -name 'index.html' -o -name 'index.htm' \) \
  ! -path '*/node_modules/*' \
  ! -path '*/dist/*' \
  ! -path '*/.next/*' \
  ! -path '*/vendor/*' \
  2>/dev/null)

if [[ "$changed" -eq 1 ]]; then
  echo "Applied BOOTH support to $ROOT (shop: $shop_url)"
  exit 2
fi

echo "No changes needed for $ROOT"
exit 0
