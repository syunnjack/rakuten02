# Ranking site trailing-slash canonical patches

Final update: **2026-08-13**

These patches fix the ColorfulBOX ranking warn `canonical-no-slash` by using a trailing-slash homepage canonical while keeping `url()->current()` for other routes.

## Patches (10)

| Repo | Patch | Domain |
|------|-------|--------|
| adult-comic-ranking | `patches/adult-comic-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosolu.pro |
| adult-figure-ranking | `patches/adult-figure-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosolu.link |
| adult-novel-ranking | `patches/adult-novel-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosolu.email |
| bl-tl-doujin-ranking | `patches/bl-tl-doujin-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosolu.help |
| bl-tl-novel-ranking | `patches/bl-tl-novel-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosolu.org |
| cross-asp-ranking | `patches/cross-asp-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosoru.click |
| duga-video-ranking | `patches/duga-video-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosoru.tokyo |
| gravure-photo-ranking | `patches/gravure-photo-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosolu.net |
| mature-genre-ranking | `patches/mature-genre-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosolu.tokyo |
| r18-anime-ranking | `patches/r18-anime-ranking/0001-Use-trailing-slash-homepage-canonical.patch` | sosolu.xyz |

Canonical change (all):

```blade
<link rel="canonical" href="{{ request()->is('/') ? rtrim(config('app.url'), '/').'/' : url()->current() }}">
```

`adult-novel-ranking` also adds `docs/SEARCH-CONSOLE.md`: **sosolu.email still needs a real Search Console verification token** — do not invent one.

## Apply

Dry-run:

```bash
PUSH=false bash scripts/site-analytics/apply-ranking-canonical-patches.sh
```

Apply + PR (needs `CROSS_REPO_PAT` or `gh` write access):

```bash
export CROSS_REPO_PAT=ghp_...
PUSH=true CREATE_PRS=true bash scripts/site-analytics/apply-ranking-canonical-patches.sh
```

Or manually per repo:

```bash
git clone https://github.com/syunnjack/<repo>.git
cd <repo>
git am /path/to/rakuten02/patches/<repo>/0001-Use-trailing-slash-homepage-canonical.patch
```

Regenerate patches from live master (optional):

```bash
bash scripts/site-analytics/_gen-ranking-canonical-patches.sh
```

## GA4 note (cannot invent IDs)

For **sosolu.net / sosolu.tokyo / sosoru.tokyo**, GA4 is server `.env` `GA4_MEASUREMENT_ID` only (ColorfulBOX). Do not invent measurement IDs in patches.

## Related

- Live ledger: `docs/RANKING-SITES.md`
- Signal check: `bash scripts/site-analytics/check-ranking-signals.sh`
