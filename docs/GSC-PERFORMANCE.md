# Search Console パフォーマンス改善ログ

最終更新: **2026-08-13**

| # | サイト | ライブ状態 | 対応 |
|---|--------|------------|------|
| 1 | shudenhotel.jp | ✅ https canonical / GA4 / GSC / FAQ / HEAD / IndexNow key | **PR #34 マージ＆本番反映済** |
| 2 | busselect.jp | ❌ GA4/GSC プレースホルダ | パッチ `0005` 適用待ち + Site Creator 実トークン |
| 3 | darekore.jp | ✅ 基本OK | パッチ `0005` 適用待ち（IndexNow 送信済） |
| 4 | machi-list.jp | 🟡 YOUR_VC_* 残 | パッチ `0003` 適用待ち（IndexNow 送信済） |
| 5 | goalpilot.jp | 🟡 canonical は og:url 経由 | パッチ `0002` 適用待ち |

## shudenhotel.jp — 本番確認（2026-08-13）

```text
canonical = https://shudenhotel.jp/
GA4       = G-542370310
GSC       = z2cnfDF9eYms_...
FAQPage   = present
HEAD /    = 200
/search   = noindex + canonical → /areas/...
IndexNow key file = 200
```

IndexNow API は key 公開直後に `UserForbiddedToAccessSite` (403) を返すことがある。  
静的 `wwwroot/shudenhotelindex2026.txt` を追加し、workflow でリトライする。

## 他サイトパッチ適用

1. **推奨（PAT があれば）**  
   GitHub Secret `CROSS_REPO_PAT`（classic / `repo`）を設定 →  
   Actions **Apply GSC patches to site repos** を Run workflow

2. **ローカル**  
   `patches/APPLY-GSC-2026-08-12.md`  
   または `.\scripts\site-analytics\apply-patches.ps1`  
   または `bash scripts/site-analytics/apply-gsc-patches.sh`（`CROSS_REPO_PAT` 付き）

パッチ適用は `/tmp` クローンで 4/4 `git am` 成功を確認済み。

| サイト | パッチ |
|--------|--------|
| busselect | `patches/kousokubus-benri/0005-...` |
| darekore | `patches/task-dashboard/0005-...` |
| machi-list | `patches/machi-list/0003-...` |
| goalpilot | `patches/goal-pilot-app/0002-...` |

## IndexNow

| サイト | 結果 |
|--------|------|
| darekore.jp | HTTP 200（~49 URL） |
| machi-list.jp | HTTP 200（~49 URL） |
| busselect.jp | HTTP 200（~50 URL） |
| shudenhotel.jp | key 200 / API 403（伝播待ち・リトライ） |

`bash scripts/site-analytics/submit-indexnow.sh`

## 自動化

- `check-gsc-signals.sh` + `.github/workflows/gsc-health.yml`
- `.github/workflows/apply-gsc-patches.yml`（CROSS_REPO_PAT）
- GSC API ツール: PR #33 `sitemap-auto/`

## ユーザー側残り

1. `CROSS_REPO_PAT` を設定して Apply GSC patches workflow 実行（またはローカル `git am`）
2. busselect Site Creator に実 GA4/GSC トークン
3. Search Console で各 sitemap 再送信（特に shudenhotel は https 版へ）
4. （任意）PR #33 sitemap-auto + `GSC_SERVICE_ACCOUNT_JSON`
