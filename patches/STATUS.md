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
| shudenhotel | ✅ PR #34–#38: https / GA4 / GSC / FAQ / 関西・名古屋LP |
| darekore | パッチ `0005` 適用待ち |
| goalpilot | パッチ `0002` 適用待ち |
| machi-list | パッチ `0003` 適用待ち |
| busselect | パッチ `0005` + Site Creator 実トークン待ち |

---

## トラック B — DTI

| リポ | 状態 |
|------|------|
| hey-douga-guide | master に CSV import 済。残り Devin #2/#3/#4 + 本番 migrate |
| free-sample-hub | Devin #1 をマージ（`complete-dti-rollout.sh`） |

---

## ユーザー作業（優先順）

1. `.\scripts\site-analytics\complete-gsc-rollout.ps1`（または CROSS_REPO_PAT workflow）
2. busselect Site Creator 実トークン
3. Search Console sitemap 再送信 ×5
4. （任意）sitemap-auto 単体 repo + GSC SA
5. hey-douga 本番 migrate
