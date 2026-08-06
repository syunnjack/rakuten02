# hey-douga-guide — 本番デプロイ

**PR #1 マージ済**（2026-08-06）  
`Add DTI CSV import, MP4 playback, and thumbnail derivation`

ローカル作業・PR マージは完了。残りは **本番サーバー** で migrate + import。

## PR（参考・完了）

~~https://github.com/syunnjack/hey-douga-guide/compare/master...cursor/dti-csv-import-f103~~  
→ マージ済: https://github.com/syunnjack/hey-douga-guide/pull/1

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
