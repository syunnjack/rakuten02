# free-sample-hub — セットアップ（PowerShell はユーザー側）

**現行ルート:** [Devin PR #1](https://github.com/syunnjack/free-sample-hub/pull/1) をマージ（ローカル 0001–0003 は現行 main と衝突）。

```bash
bash scripts/site-analytics/complete-dti-rollout.sh
```

パッチ適用〜ローカル確認は PowerShell で実施。手順は `patches/DEPLOY-WINDOWS.md` セクション 2 を参照。

## パッチ（0001 → 0002 → 0003 の順）

| # | 内容 |
| --- | --- |
| 0001 | DTI インポート基盤、MP4 UI、DB スキーマ |
| 0002 | Premium/HEYZO URL 推定、424行 CSV |
| 0003 | サムネイル推定、video poster |

## インポート後の確認

- `samples:import-csv` で 424 行取り込み
- `php artisan serve --port=8002` → カードに MP4 再生

## 環境変数（.env）

```env
DMM_API_ID=
DMM_AFFILIATE_ID=
DTI_AFFILIATE_ID=162667
GA4_MEASUREMENT_ID=
```

## 同期コマンド

```powershell
php artisan samples:sync          # FANZA iframe
php artisan samples:sync-dti      # DTI RSS → MP4
php artisan samples:import-csv database\seeders\data\dti-movies.csv
```

## マージ用 PR（完了後）

```powershell
git checkout -b cursor/dti-csv-import-f103
git push -u origin cursor/dti-csv-import-f103
```

GitHub で PR 作成 → master マージ。
