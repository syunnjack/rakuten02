# hey-douga-guide パッチ

本番ホスト: **https://sosoru.org/**（GA4 `G-DDSV1YXLEB` / GSC ライブ済）

## 状態

| # | 内容 | 状態 |
| --- | --- | --- |
| 0001–0002 | CSV インポート / RSS 補完 | **master 済**（PR #1） |
| 0003 | canonical / robots / sitemap from APP_URL | Devin #2（パッチ同梱） |
| 0004 | https sample media | Devin #3（パッチ同梱） |
| 0005 | crawlable work/provider pages | Devin #4（パッチ同梱） |

## 適用（未マージ時）

```bash
bash scripts/site-analytics/complete-dti-rollout.sh
# または
git clone https://github.com/syunnjack/hey-douga-guide.git
cd hey-douga-guide
for p in 0003 0004 0005; do
  git am /path/to/rakuten02/patches/hey-douga-guide/${p}-*.patch
done
```

## 本番

```bash
php artisan migrate
php artisan dti:import-csv database/seeders/data/dti-movies.csv --verify-sample
```
