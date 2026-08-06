# 映画データ処理 (DTI CSV)

DTI CASH アフィリエイトなどからエクスポートした映画 CSV の検証・補完用スクリプトです。

## CSV 形式

```text
movie_id,site_id,site_name,title,actress,description,release_date,sample_url,aff_link,original_id,sample_movie_url_2,provider_name
```

## 使い方

```bash
python3 scripts/movie-data/process-dti-csv.py scripts/movie-data/dti-movies.csv --check-sample
```

- `sample_movie_url_2` が空の場合、`sample_url` からカリビアンコム MP4 URL を推定
- `provider_name` が空の場合、`site_name` をコピー
- `--check-sample` でサンプル MP4 の HEAD 確認

## free-sample-hub への反映

`free-sample-hub` リポジトリ向けの Laravel パッチを同梱しています。

```bash
git clone https://github.com/syunnjack/free-sample-hub.git
cd free-sample-hub
for p in 0001 0002 0003; do
  curl -L "https://github.com/syunnjack/rakuten02/raw/master/patches/free-sample-hub/${p}-"*.patch | git am
done
php artisan migrate
php artisan samples:import-csv database/seeders/data/dti-movies.csv
```

または一括適用:

```bash
./scripts/movie-data/apply-dti-patches.sh free-sample-hub
```

## hey-douga-guide への反映

```bash
git clone https://github.com/syunnjack/hey-douga-guide.git
cd hey-douga-guide
for p in 0001 0002; do
  curl -L "https://github.com/syunnjack/rakuten02/raw/master/patches/hey-douga-guide/${p}-"*.patch | git am
done
php artisan migrate
php artisan dti:import-csv database/seeders/data/dti-movies.csv --verify-sample
```

または一括適用:

```bash
./scripts/movie-data/apply-dti-patches.sh hey-douga-guide
```

詳細: `patches/hey-douga-guide/README.md`

全体ステータス: `patches/STATUS.md`  
hey-douga-guide PR マージ手順: `patches/hey-douga-guide/MERGE-PR.md`

## 取り込み対象 (2026/08/06)

最新バッチ: `_var3_tmp_162667 (5).csv` — **424行**

| サイト | 件数 | サンプル HEAD OK |
| --- | ---: | ---: |
| カリビアンコム | 190 | 190 |
| カリビアンコムプレミアム | 166 | 166 |
| HEYZO | 68 | 52 (16件はサンプル未公開) |

出力: `scripts/movie-data/dti-movies.csv`

### URL 推定ルール

| サイト | パターン |
| --- | --- |
| カリビアンコム | `http://smovie.caribbeancom.com/sample/movies/{code}/sample_m.mp4` |
| カリビアンコムプレミアム | `https://smovie.caribbeancompr.com/sample/movies/{code}/480p.mp4` |
| HEYZO | `https://www.heyzo.com/contents/3000/{id}/heyzo_hd_{id}_sample.mp4` |

### 先頭行の例

| 項目 | 値 |
| --- | --- |
| movie_id | 224498 |
| 作品コード | 080626-001 |
| サイト | カリビアンコム (site_id: 2468) |
| タイトル | タイムファックバンディット 時間よ止まれ ~高級レストラン編~ |
| 出演 | 野々宮すず / 笹宮えれな |
| サンプル MP4 | http://smovie.caribbeancom.com/sample/movies/080626-001/sample_m.mp4 |
