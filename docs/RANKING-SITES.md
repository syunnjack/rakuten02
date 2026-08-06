# ランキングサイト一覧（AI 作成・未デプロイ）

2026-08-05〜06 に作成された FANZA/DMM アフィリエイト系ランキングサイト群。

## 現状

- GitHub 上に **41 リポジトリ**（`*-ranking`  suffix）
- **未デプロイ:** `https://syunnjack.github.io/{repo}/` → 404
- **独自ドメイン:** 未割当（カスタムドメイン rollout 対象外）

## スタック

| 種別 | 例 | 技術 |
|------|-----|------|
| PHP | netorare-ranking, gyaru-ranking | index.php + DmmClient |
| Astro | play-withca-ranking, duga-video-ranking | Astro 7 + Vercel adapter |

## 一覧取得

```powershell
gh repo list syunnjack --limit 100 --json name,updatedAt `
  --jq '.[] | select(.name | test("-ranking$")) | .name' | Sort-Object
```

## 次フェーズ（要計画）

1. ドメイン割当表の作成（repo ↔ ドメイン）
2. デプロイ先の統一（Astro → Vercel、PHP → Render 等）
3. `scripts/site-analytics/` による GA4/GSC/sitemap 横展開
4. DTI CSV 連携が必要なサイトの選定（hey-douga / free-sample-hub とは別系統）

## 関連

- カスタムドメイン 5 サイト: `docs/SITE-ROLLOUT.md`
- DTI 動画: `patches/DEPLOY-WINDOWS.md`
