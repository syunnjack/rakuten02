#!/usr/bin/env bash
# Clone ranking repos shallow and write format-patches under patches/<repo>/.
# Run from rakuten02 root. Requires network + git.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
WORK="${TMPDIR:-/tmp}/ranking-canonical-gen-$$"
CANON_OLD='  <link rel="canonical" href="{{ url()->current() }}">'
CANON_NEW='  <link rel="canonical" href="{{ request()->is('\''/'\'') ? rtrim(config('\''app.url'\''), '\''/'\'')'\''.'\''/'\'' : url()->current() }}">'

# Prefer literal replacement via Python for quoting safety
repos=(
  adult-comic-ranking
  adult-figure-ranking
  adult-novel-ranking
  bl-tl-doujin-ranking
  bl-tl-novel-ranking
  cross-asp-ranking
  duga-video-ranking
  gravure-photo-ranking
  mature-genre-ranking
  r18-anime-ranking
)

mkdir -p "$WORK"
cleanup() { rm -rf "$WORK"; }
trap cleanup EXIT

export GIT_AUTHOR_NAME="${GIT_AUTHOR_NAME:-Cursor Agent}"
export GIT_AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-cursoragent@cursor.com}"
export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME"
export GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"

for repo in "${repos[@]}"; do
  echo "======== generate $repo ========"
  dest="$WORK/$repo"
  git clone --depth 1 "https://github.com/syunnjack/${repo}.git" "$dest"
  cd "$dest"

  blade="resources/views/welcome.blade.php"
  if [[ ! -f "$blade" ]]; then
    echo "MISSING $blade"
    exit 1
  fi

  python3 - <<'PY'
from pathlib import Path
path = Path("resources/views/welcome.blade.php")
text = path.read_text(encoding="utf-8")
old = '  <link rel="canonical" href="{{ url()->current() }}">'
new = "  <link rel=\"canonical\" href=\"{{ request()->is('/') ? rtrim(config('app.url'), '/').'/' : url()->current() }}\">"
if old not in text:
    # tolerate slight spacing variants
    import re
    m = re.search(r'[ \t]*<link rel="canonical" href="\{\{\s*url\(\)->current\(\)\s*\}\}">', text)
    if not m:
        raise SystemExit(f"canonical line not found in {path}")
    text = text[:m.start()] + new + text[m.end():]
else:
    text = text.replace(old, new, 1)
path.write_text(text, encoding="utf-8")
print("updated canonical")
PY

  if [[ "$repo" == "adult-novel-ranking" ]]; then
    mkdir -p docs
    cat > docs/SEARCH-CONSOLE.md <<'EOF'
# Search Console — sosolu.email

`sosolu.email` (this site) still needs a **real** Google Search Console ownership
verification token (`google-site-verification` meta or HTML file).

Do **not** invent or copy a token from another property. Add the token only after
creating/verifying the property in Search Console for `https://sosolu.email/`.
EOF
    git add docs/SEARCH-CONSOLE.md
  fi

  git add "$blade"
  git commit -m "Use trailing slash homepage canonical"

  out_dir="$ROOT/patches/$repo"
  mkdir -p "$out_dir"
  git format-patch -1 HEAD -o "$out_dir" --filename-max-length=80
  # Normalize patch name
  generated="$(ls -1 "$out_dir"/*.patch | tail -1)"
  target="$out_dir/0001-Use-trailing-slash-homepage-canonical.patch"
  if [[ "$generated" != "$target" ]]; then
    mv "$generated" "$target"
  fi
  echo "wrote $target"
done

echo "Done. See patches/ranking-sites/README.md"
