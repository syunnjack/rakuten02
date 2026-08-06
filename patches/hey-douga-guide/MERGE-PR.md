# hey-douga-guide — GitHub で PR マージ

PowerShell 作業は完了済み。あとは **GitHub 上で PR を作成・マージ**するだけです。

## PR 作成

👉 https://github.com/syunnjack/hey-douga-guide/compare/master...cursor/dti-csv-import-f103

**Title:**
```
Add DTI CSV import, MP4 playback, and thumbnail derivation
```

**Body:**
```
## 変更内容

- `dti:import-csv` — affstats CSV インポート（424行シード同梱）
- サムネイル / サンプル MP4 URL 自動推定（カリビアンコム / プレミアム / HEYZO）
- 新着動画カード UI（動画プレイヤー + サイトタグ）
- RSS 同期時も page URL / サムネ / MP4 を補完

## 本番デプロイ後

php artisan migrate --force
php artisan dti:import-csv database/seeders/data/dti-movies.csv
php artisan dti:sync

パッチ元: syunnjack/rakuten02 `patches/hey-douga-guide/`
```

## マージ後（本番サーバー）

PowerShell で実行:

```powershell
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan dti:import-csv database\seeders\data\dti-movies.csv
php artisan dti:sync
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## 定期実行

タスクスケジューラで 15 分ごと:

```text
php {path}\artisan schedule:run
```

`dti:sync` は 3 時間ごとに自動実行されます。
