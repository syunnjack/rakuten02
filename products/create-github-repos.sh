#!/usr/bin/env bash
# Create one GitHub repository per Chitamaru product and push main.
# Cloud Agent の GITHUB_TOKEN は createRepository が 403 のため、
# repo スコープの PAT を GH_TOKEN または CROSS_REPO_PAT に渡して実行する。
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
OWNER="${GITHUB_OWNER:-syunnjack}"
TOKEN="${GH_TOKEN:-${CROSS_REPO_PAT:-${GITHUB_TOKEN:-}}}"

if [[ -z "${TOKEN}" ]]; then
  echo "Set GH_TOKEN (classic PAT with repo scope) and re-run." >&2
  echo "Example:" >&2
  echo "  GH_TOKEN=ghp_xxx START=1 LIMIT=16 $0" >&2
  exit 1
fi

if [[ ! -d "$ROOT/chitamaru-hotel-price-watch" ]]; then
  python3 "$ROOT/generate.py"
fi

export GH_TOKEN="$TOKEN"
export GH_PROMPT_DISABLED=1

START="${START:-1}"
LIMIT="${LIMIT:-16}"
rank=0
created=0
skipped=0
failed=0

while IFS= read -r repo; do
  rank=$((rank + 1))
  if (( rank < START )); then
    continue
  fi
  if (( rank >= START + LIMIT )); then
    break
  fi

  dir="$ROOT/$repo"
  if [[ ! -d "$dir" ]]; then
    echo "missing $dir" >&2
    failed=$((failed + 1))
    continue
  fi

  echo "=== [$rank] $OWNER/$repo ==="
  if gh api "repos/$OWNER/$repo" >/dev/null 2>&1; then
    echo "exists, pushing updates"
  else
    if ! gh repo create "$OWNER/$repo" --public --description "Chitamaru product: $repo" >/dev/null; then
      echo "create failed: $OWNER/$repo" >&2
      failed=$((failed + 1))
      continue
    fi
    created=$((created + 1))
  fi

  work="$(mktemp -d)"
  cp -a "$dir/." "$work/"
  (
    cd "$work"
    git init -b main >/dev/null
    git add -A
    git -c user.email="syunnjack@users.noreply.github.com" \
        -c user.name="chitamaru-bot" \
        commit -m "Initial product repo: $repo" >/dev/null
    git remote add origin "https://x-access-token:${TOKEN}@github.com/${OWNER}/${repo}.git"
    git push -u origin main --force
  )
  rm -rf "$work"
  skipped=$((skipped + 1))
done < <(python3 -c "import json; from pathlib import Path; d=json.loads(Path('$ROOT/catalog.json').read_text()); print('\\n'.join(p['repo'] for p in d['products']))")

echo "done created=$created attempted_push=$skipped failed=$failed"
