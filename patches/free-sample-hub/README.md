# free-sample-hub パッチ

DTI affstats CSV インポート、MP4 サンプル再生、サムネイル推定を追加します。

## 適用手順

```bash
git clone https://github.com/syunnjack/free-sample-hub.git
cd free-sample-hub
for p in 0001 0002 0003; do
  curl -L "https://github.com/syunnjack/rakuten02/raw/master/patches/free-sample-hub/${p}-"*.patch | git am
done
php artisan migrate
php artisan samples:import-csv database/seeders/data/dti-movies.csv
```

## パッチ一覧

| # | 内容 |
| --- | --- |
| 0001 | DTI インポート基盤、MP4 再生 UI、DB スキーマ拡張 |
| 0002 | Premium/HEYZO URL 推定、424行 CSV シード |
| 0003 | サムネイル URL 推定（`image_url`）、video poster 対応 |

## コマンド

| コマンド | 説明 |
| --- | --- |
| `samples:import-csv {path}` | affstats CSV をインポート |
| `samples:sync-dti` | DTI RSS から Caribbeancom 作品を同期 |
| `samples:sync-dti --verify-sample` | MP4 HEAD 確認付き同期 |
