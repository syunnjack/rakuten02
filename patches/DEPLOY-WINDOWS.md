# DTI CSV 連携 — Windows (PowerShell) デプロイ手順

## 前提

- Git / PHP 8.2+ / Composer が PATH に入っていること
- `rakuten02` を clone 済み: `C:\Users\syunn\rakuten02`

---

## 1. hey-douga-guide（完了済みの場合はスキップ可）

```powershell
cd C:\Users\syunn
git clone https://github.com/syunnjack/hey-douga-guide.git
cd hey-douga-guide

git am C:\Users\syunn\rakuten02\patches\hey-douga-guide\0001-Add-DTI-CSV-import-sample-MP4-playback-and-thumbnail.patch
git am C:\Users\syunn\rakuten02\patches\hey-douga-guide\0002-Enrich-RSS-sync-with-page-URL-thumbnails-and-sample-.patch

copy .env.example .env
composer install
php artisan key:generate
php artisan migrate

# HEAD確認なし推奨（Windows では verify で多くスキップされる）
php artisan dti:import-csv database\seeders\data\dti-movies.csv

php artisan dti:sync
php artisan serve --port=8001
```

→ http://127.0.0.1:8001

### GitHub へ push

```powershell
git checkout -b cursor/dti-csv-import-f103
git push -u origin cursor/dti-csv-import-f103
```

GitHub で PR 作成 → master にマージ。

---

## 2. free-sample-hub（次の作業）

本番は **https://sosoru.asia/**。パッチは Devin PR #1 相当の `0004` を使用。

```powershell
cd C:\Users\syunn
git clone https://github.com/syunnjack/free-sample-hub.git
cd free-sample-hub

git am C:\Users\syunn\rakuten02\patches\free-sample-hub\0004-Add-DTI-CSV-import-with-https-only-sample-media.patch

copy .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan samples:import-csv database\seeders\data\dti-movies.csv

php artisan serve --port=8002
```

→ http://127.0.0.1:8002

`.env` に `DMM_API_ID` / `DMM_AFFILIATE_ID` / `DTI_AFFILIATE_ID` を設定後:

```powershell
php artisan samples:sync
php artisan samples:sync-dti
```

---

## 3. 本番サーバー

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

### 定期 RSS 同期（Windows タスクスケジューラ）

15分ごとに:

```text
php C:\path\to\hey-douga-guide\artisan schedule:run
```

---

## トラブルシュート

| 症状 | 対処 |
| --- | --- |
| 別サイトが表示される | `php artisan serve --port=8001` など別ポートを使う |
| `git am` 失敗 | `git am --abort` → master で clone し直し |
| エラー文を貼り付けて実行 | **出力は貼らない**。`php artisan ...` だけ入力 |
| import で大量 skip | `--verify-sample` を外して再実行 |

---

## 一括パッチ適用（PowerShell スクリプト）

```powershell
cd C:\Users\syunn\rakuten02
.\scripts\movie-data\apply-dti-patches.ps1 -Target free-sample-hub
```
