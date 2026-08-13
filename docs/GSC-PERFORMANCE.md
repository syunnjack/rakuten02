# Search Console パフォーマンス改善ログ

最終更新: **2026-08-13**

対象プロパティ（ライブ監査）:

| # | サイト | 重大Issue | 本ラウンドの対応 |
|---|--------|-----------|-----------------|
| 1 | shudenhotel.jp | canonical/sitemap が `http://`、GA4/GSC メタ欠落、`/search` が index、IndexNow key 404、HEAD 405 | **本リポジトリで修正**（PR #34） |
| 2 | busselect.jp | GSC/GA4 が日本語プレースホルダ、title 二重 `| NOLU` | パッチ `0005` |
| 3 | darekore.jp | title が薄い、`/?q=` が index、sitemap 未エンコード | パッチ `0005` + IndexNow 送信済 |
| 4 | machi-list.jp | 空ページで robots 競合、ホームに YOUR_VC_* | パッチ `0003` + IndexNow 送信済 |
| 5 | goalpilot.jp | sitemap 欠落ルート、OG image なし、vercel robots 残骸 | パッチ `0002` |

## Site 1 — shudenhotel.jp（PR #34）

- ForwardedHeaders + `PUBLIC_BASE_URL=http://...` でも本番は `https://` 正規化
- `www` → apex 301、HSTS
- `/search` を `noindex`、sitemap から除外、エラー時は 400/503
- 検索 canonical は対応 LP / ホームへ寄せる
- IndexNow key 常時配信（デフォルト `shudenhotelindex2026`）
- GA4 / GSC は env 欠落時も Blueprint 値へフォールバック
- ホームに FAQ + FAQPage JSON-LD、preconnect
- 主要 HTML ルートで HEAD 対応

デプロイ後チェック:

```bash
bash scripts/site-analytics/check-gsc-signals.sh
curl -s https://shudenhotel.jp/ | grep canonical   # https://
curl -sI https://shudenhotel.jp/shudenhotelindex2026.txt | head -1  # 200
```

## 他サイトパッチ

適用手順: `patches/APPLY-GSC-2026-08-12.md`  
一括: `.\scripts\site-analytics\apply-patches.ps1`

| サイト | パッチ |
|--------|--------|
| busselect | `patches/kousokubus-benri/0005-Reject-placeholder-GA4-GSC-and-fix-title.patch` |
| darekore | `patches/task-dashboard/0005-Improve-GSC-title-noindex-query-and-sitemap-encoding.patch` |
| machi-list | `patches/machi-list/0003-Fix-robots-conflict-and-valuecommerce-placeholders.patch` |
| goalpilot | `patches/goal-pilot-app/0002-Expand-sitemap-remove-vercel-robots-add-jsonld.patch` |

## IndexNow（2026-08-13 送信済）

| サイト | 結果 |
|--------|------|
| darekore.jp | HTTP 200（約49 URL） |
| machi-list.jp | HTTP 200（約49 URL） |
| busselect.jp | HTTP 200（約50 URL） |
| shudenhotel.jp | SKIP（key 404 — PR #34 デプロイ後に再実行） |

再実行: `bash scripts/site-analytics/submit-indexnow.sh`

## 自動化まわり

- ライブ信号監視: `.github/workflows/gsc-health.yml` + `scripts/site-analytics/check-gsc-signals.sh`
- GSC API 自動送信ツールは別 PR: https://github.com/syunnjack/rakuten02/pull/33（`sitemap-auto/`）

## ユーザー側（エージェント不可）

1. PR #34 をマージ → Render 再デプロイ
2. 他4サイトへパッチ適用（`APPLY-GSC-2026-08-12.md`）
3. busselect: Site Creator の `NEXT_PUBLIC_GOOGLE_*` を実トークンへ
4. Search Console で各 sitemap 再送信
5. （任意）PR #33 の `sitemap-auto` を別リポジトリ化し `GSC_SERVICE_ACCOUNT_JSON` を設定
