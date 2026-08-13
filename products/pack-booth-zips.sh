#!/usr/bin/env bash
# Pack each product repo into a BOOTH-ready ZIP (no node_modules / dist / .git).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
OUT="$ROOT/dist-zips"
rm -rf "$OUT"
mkdir -p "$OUT"

python3 -c "import json; from pathlib import Path; d=json.loads(Path('$ROOT/catalog.json').read_text()); print('\\n'.join(p['repo'] for p in d['products']))" \
| while IFS= read -r repo; do
  dir="$ROOT/$repo"
  [[ -d "$dir" ]] || { echo "missing $dir" >&2; exit 1; }
  zip_path="$OUT/${repo}.zip"
  (
    cd "$ROOT"
    zip -qr "$zip_path" "$repo" -x "$repo/node_modules/*" "$repo/dist/*" "$repo/.git/*"
  )
  echo "wrote $zip_path ($(wc -c < "$zip_path") bytes)"
done

echo "ZIPs in $OUT"
