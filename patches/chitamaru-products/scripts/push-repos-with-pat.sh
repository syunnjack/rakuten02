#!/usr/bin/env bash
# Create & push each chitamaru-* product repo to github.com/syunnjack/
# Requires a classic PAT with `repo` scope (cloud agent token cannot create repos).
#
# Usage:
#   export GH_TOKEN=ghp_xxxxxxxx
#   ./patches/chitamaru-products/scripts/push-repos-with-pat.sh
#
# Optional:
#   OWNER=syunnjack VISIBILITY=private ./.../push-repos-with-pat.sh
#   START=1 LIMIT=10 ./.../push-repos-with-pat.sh   # push only rank 1-10 first

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPOS_DIR="$ROOT/repos"
MANIFEST="$ROOT/catalog/repo-manifest.txt"
OWNER="${OWNER:-syunnjack}"
VISIBILITY="${VISIBILITY:-private}"
START="${START:-1}"
LIMIT="${LIMIT:-0}"

if [[ -z "${GH_TOKEN:-${GITHUB_TOKEN:-}}" ]]; then
  echo "Set GH_TOKEN (or GITHUB_TOKEN) to a PAT that can create repos under ${OWNER}."
  exit 1
fi
export GH_TOKEN="${GH_TOKEN:-$GITHUB_TOKEN}"

if ! command -v gh >/dev/null; then
  echo "gh CLI is required"
  exit 1
fi

mapfile -t REPOS < "$MANIFEST"
total=${#REPOS[@]}
echo "Manifest: ${total} repos → ${OWNER} (${VISIBILITY})"

idx=0
pushed=0
for name in "${REPOS[@]}"; do
  idx=$((idx + 1))
  if (( idx < START )); then continue; fi
  if (( LIMIT > 0 && pushed >= LIMIT )); then break; fi

  dir="$REPOS_DIR/$name"
  if [[ ! -d "$dir" ]]; then
    echo "[$idx/$total] SKIP missing $name"
    continue
  fi

  echo "[$idx/$total] $name"
  cd "$dir"
  if [[ ! -d .git ]]; then
    git init -b main
    git add -A
    git -c user.email="chitamaru@syunnjack.dev" -c user.name="Chitamaru" \
      commit -m "Initial scaffold: ${name}" || true
  fi

  if gh repo view "${OWNER}/${name}" >/dev/null 2>&1; then
    echo "  remote exists — push"
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/${OWNER}/${name}.git"
    git push -u origin main
  else
    echo "  create + push"
    gh repo create "${OWNER}/${name}" "--${VISIBILITY}" --source=. --remote=origin --push
  fi
  pushed=$((pushed + 1))
done

echo "Done. Pushed ${pushed} repos."
