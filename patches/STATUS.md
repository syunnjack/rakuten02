# プロジェクト全体ステータス

最終更新: **2026-08-13**  
**チェックリスト:** `docs/REMAINING-WORK.md`  
**GSC:** `docs/GSC-PERFORMANCE.md` / `docs/GSC-FINISH.md`

---

## トラック S — Sitemap Auto

| 項目 | 状態 |
|------|------|
| ソース `sitemap-auto/` | ✅ |
| 単体 repo へ初回 push | ❌（`sitemap-auto/docs/SETUP-REPO.md`） |
| Secret `GSC_SERVICE_ACCOUNT_JSON` | ❌ |
| 積み上げログ ストア掲載 | パッチ用意済み `patches/tsumiage-log/` |

---

## トラック A — カスタムドメイン

| サイト | 状態 |
|--------|------|
| shudenhotel | ✅ PR #34–#38: https / GA4 / GSC / FAQ / 関西・名古屋・福岡・札幌・神戸LP |
| darekore | パッチ `0005`+`0006` 適用待ち |
| goalpilot | パッチ `0002`+`0003` 適用待ち |
| machi-list | パッチ `0003`+`0004` 適用待ち |
| busselect | パッチ `0005`+`0006` + Site Creator 実 GA4 待ち |

---

## トラック B — DTI

| リポ | 状態 |
|------|------|
| hey-douga-guide | master に CSV import 済。0003–0005 = Devin #2/#3/#4。本番 sosoru.org |
| free-sample-hub | パッチ `0004` = Devin #1。本番 sosoru.asia |

適用: `bash scripts/site-analytics/apply-dti-patches.sh`（または `complete-dti-rollout.sh`）  
Dry-run: `PUSH=false MERGE_EXISTING_PRS=false bash scripts/site-analytics/apply-dti-patches.sh`

---

## トラック C — ランキング

ライブ台帳: `docs/RANKING-SITES.md`（ColorfulBOX 稼働 / WPX DNS 待ち）  
`bash scripts/site-analytics/check-ranking-signals.sh`

Trailing-slash homepage canonical パッチ: `patches/ranking-sites/README.md`（10 件）  
適用: `PUSH=false bash scripts/site-analytics/apply-ranking-canonical-patches.sh`  
GA4（sosolu.net / sosolu.tokyo / sosoru.tokyo）は ColorfulBOX `.env` の `GA4_MEASUREMENT_ID` のみ（ID を捏造しない）  
sosolu.email は Search Console 実トークンが必要（`adult-novel-ranking` の docs 注記）

---

## ユーザー作業（優先順）

1. `.\scripts\site-analytics\complete-gsc-rollout.ps1`（または CROSS_REPO_PAT）
2. `bash scripts/site-analytics/apply-dti-patches.sh`（DTI）
3. busselect Site Creator 実トークン
4. Search Console sitemap 再送信 ×5
5. Bing Webmaster（shudenhotel IndexNow）
6. ColorfulBOX 3 件 API キー復旧 / WPX 17 件 DNS / ranking canonical パッチ
7. （任意）sitemap-auto 単体 repo + GSC SA
