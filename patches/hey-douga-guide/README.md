# hey-douga-guide パッチ

DTI affstats CSV インポート、サムネイル/MP4 推定、サンプル動画付きカード UI を追加します。

## 適用手順

パッチ 0001 / 0002 は **PR #1 で master に取り込み済み**です。再適用しないでください。

残りの SEO/HTTPS/詳細ページは Devin PR をマージ:

```bash
bash scripts/site-analytics/complete-dti-rollout.sh
```

- [#2](https://github.com/syunnjack/hey-douga-guide/pull/2) canonical / robots from APP_URL
- [#3](https://github.com/syunnjack/hey-douga-guide/pull/3) https sample media
- [#4](https://github.com/syunnjack/hey-douga-guide/pull/4) crawlable work/provider pages

本番:

```bash
php artisan migrate
php artisan dti:import-csv database/seeders/data/dti-movies.csv --verify-sample
```

## パッチ一覧

| # | 内容 |
| --- | --- |
| 0001 | CSV インポート、MP4 再生、サムネイル推定、424行シード |
| 0002 | RSS 同期時も page URL / サムネ / MP4 を自動補完 |

## 追加コマンド

| コマンド | 説明 |
| --- | --- |
| `dti:import-csv {path}` | affstats CSV をインポート |
| `dti:import-csv {path} --verify-sample` | サンプル MP4 の HEAD 確認後にインポート |
| `dti:sync` | RSS 同期（CSV 行は削除しない） |

## CSV 列（affstats エクスポート）

```text
movie_id,site_id,site_name,title,actress,description,release_date,sample_url,aff_link,original_id,sample_movie_url_2,provider_name
```

**画像 URL 列は含まれません。** `sample_url`（公式ページ URL）からサムネイルを推定します。

| サイト | サムネイル | サンプル MP4 |
| --- | --- | --- |
| カリビアンコム | `.../moviepages/{code}/images/l_l.jpg` | `smovie.caribbeancom.com/.../sample_m.mp4` |
| カリビアンコムプレミアム | `caribbeancompr.com/.../images/l_l.jpg` | `smovie.caribbeancompr.com/.../480p.mp4` |
| HEYZO | `heyzo.com/contents/3000/{id}/gallery/001.jpg` | `heyzo_hd_{id}_sample.mp4` |

## シードデータ

パッチに `database/seeders/data/dti-movies.csv`（424行・処理済み）が同梱されています。

## free-sample-hub との違い

| | hey-douga-guide | free-sample-hub |
| --- | --- | --- |
| 主用途 | Hey動画ガイド + DTI 新着一覧 | サンプル動画ハブ |
| RSS | Hey Douga PPV 形式 | Caribbeancom movie 形式 |
| UI | ウィジェット + カードグリッド | カードグリッドのみ |
