# プロジェクト全体ステータス

<<<<<<< HEAD
最終更新: **2026-08-12**  
**チェックリスト:** `docs/REMAINING-WORK.md`
=======
最終更新: **2026-08-13**  
**チェックリスト:** `docs/REMAINING-WORK.md`  
**GSC:** `docs/GSC-PERFORMANCE.md`
>>>>>>> origin/master

---

## トラック S — Sitemap Auto

| 項目 | 状態 |
|------|------|
| ソース `sitemap-auto/` | ✅ |
| 単体 repo へ初回 push | ❌（エージェント権限外 → SETUP-REPO.md） |
| 積み上げログ ストア掲載 | パッチ用意済み `patches/tsumiage-log/` |

---

## トラック A — カスタムドメイン

| サイト | 状態 |
|--------|------|
| shudenhotel | ✅ PR #34 本番反映（https / GA4 / GSC / FAQ） |
| darekore | パッチ `0005` 適用待ち |
| goalpilot | パッチ `0002` 適用待ち |
| machi-list | パッチ `0003` 適用待ち |
| busselect | パッチ `0005` + Site Creator 実トークン待ち |

---

## ユーザー作業（優先順）

1. `CROSS_REPO_PAT` → Apply GSC patches workflow
2. busselect Site Creator 実トークン
3. Search Console sitemap 再送信
4. hey-douga 本番 migrate
