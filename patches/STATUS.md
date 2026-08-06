# DTI CSV 連携 — 全体ステータス

最終更新: 2026-08-06

## リポジトリ別

| リポジトリ | パッチ | ローカル | GitHub PR | 本番 |
|---|---|---|---|---|
| **rakuten02** | master 同梱 | — | #15 #16 #17 マージ済 | — |
| **hey-douga-guide** | 0001, 0002 | ✅ ユーザー確認済 | ブランチ push 済 → [PR 作成](hey-douga-guide/MERGE-PR.md) | 未 |
| **free-sample-hub** | 0001, 0002, 0003 | 未 | 未 | 未 |

## データ

- ソース CSV: affstats 424行
- 処理済み: `scripts/movie-data/dti-movies.csv`
- 検証: `python3 scripts/movie-data/process-dti-csv.py ... --check-sample`

## ユーザー担当（PowerShell）

- free-sample-hub セットアップ（`DEPLOY-WINDOWS.md` §2）
- 本番サーバー `git pull` + migrate + import

## エージェント担当（完了）

- パッチ作成・CI 検証（`.github/workflows/validate-dti-patches.yml`）
- Windows 手順書（`DEPLOY-WINDOWS.md`）
- `apply-dti-patches.ps1` / `.sh`

## 関連 PR（rakuten02）

- #15 DTI CSV 処理 + 424行
- #16 hey-douga / free-sample-hub パッチ
- #17 Windows デプロイガイド + CI
