# Search Console パフォーマンス改善ログ

最終更新: **2026-08-13**

| # | サイト | ライブ状態 | 対応 |
|---|--------|------------|------|
| 1 | shudenhotel.jp | ✅ https canonical / GA4 / GSC / FAQ / HEAD / IndexNow key | **PR #34–#37 本番反映済** |
| 2 | busselect.jp | ❌ GA4/GSC プレースホルダ / search が indexable | パッチ `0005` + Devin #1 + Site Creator |
| 3 | darekore.jp | ✅ 基本OK / title 薄い | パッチ `0005` + Devin #8 |
| 4 | machi-list.jp | 🟡 YOUR_VC_* 残 | パッチ `0003` + Devin #1 |
| 5 | goalpilot.jp | 🟡 canonical は og:url 経由 | パッチ `0002` + Devin #1 |

## shudenhotel.jp — 本番確認（2026-08-13）

```text
canonical = https://shudenhotel.jp/
GA4       = G-542370310
GSC       = z2cnfDF9eYms_...
FAQPage   = present
HEAD /    = 200
/search   = noindex + canonical → /areas/...
IndexNow key file = 200
IndexNow Yandex   = 200/202
IndexNow Bing     = 403 until Bing Webmaster verify
```

## 他サイトパッチ適用

**最短:** `docs/GSC-FINISH.md` のワンショット（`complete-gsc-rollout.ps1` / `.sh`）

1. Secret `CROSS_REPO_PAT` → Actions **Apply GSC patches to site repos**
2. ローカル: `bash scripts/site-analytics/apply-gsc-patches.sh`

| サイト | パッチ |
|--------|--------|
| busselect | `patches/kousokubus-benri/0005-...` |
| darekore | `patches/task-dashboard/0005-...` |
| machi-list | `patches/machi-list/0003-...` |
| goalpilot | `patches/goal-pilot-app/0002-...` |

## IndexNow

| サイト | Bing (api.indexnow.org) | Yandex |
|--------|-------------------------|--------|
| darekore.jp | 200 | 202 |
| machi-list.jp | 200 | 202 |
| busselect.jp | 200 | 202 |
| shudenhotel.jp | 403（Webmaster 未バインド） | 200/202 |

`bash scripts/site-analytics/submit-indexnow.sh`

## 自動化

- `check-gsc-signals.sh` + `.github/workflows/gsc-health.yml`
- `.github/workflows/apply-gsc-patches.yml`（CROSS_REPO_PAT）
- `complete-gsc-rollout.ps1` / `complete-gsc-rollout.sh`
- GSC API ツール: `sitemap-auto/`

## ユーザー側残り

1. ワンショットスクリプト実行（または CROSS_REPO_PAT + Actions）
2. busselect Site Creator の `NEXT_PUBLIC_GOOGLE_*`
3. Search Console sitemap ×5
4. Bing Webmaster で shudenhotel.jp 検証（IndexNow Bing 403 解消）
