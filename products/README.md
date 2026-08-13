# 16の独立製品リポジトリ

追加候補16本を **GitHub上の新規リポジトリ** として切り出すためのソースです。  
プロトタイプ（`hotel-price-watch` 等）は残し、商品名・価格・BOOTH導線を持った製品版を別リポにします。

## リポジトリ一覧

| # | GitHub repo | 商品 | 個人価格 | Phase | 既存プロトタイプ |
|---|-------------|------|----------|-------|------------------|
| 1 | `chitamaru-hotel-price-watch` | Hotel Price Watch | ¥980 | 1 | hotel-price-watch |
| 2 | `chitamaru-job-match-alert` | Job Match Alert | ¥980 | 1 | job-match-alert |
| 3 | `chitamaru-subsidy-alert-hub` | Subsidy Alert Hub | ¥2,480 | 1 | subsidy-alert-hub |
| 4 | `chitamaru-nearqueue` | NearQueue | ¥3,800 | 3 | reservation-waiting-time-v1 |
| 5 | `chitamaru-work-bar-navi` | Work Bar Navi | ¥980 | 1 | work-bar-navi |
| 6 | `chitamaru-midnight-spot-alert` | Midnight Spot Alert | ¥580 | 1 | midnight-spot-alert |
| 7 | `chitamaru-welfare-job-alert` | Welfare Job Alert | ¥980 | 1 | welfare-job-alert |
| 8 | `chitamaru-busstay` | BusStay | ¥980 | 1 | bus-arrival-guide |
| 9 | `chitamaru-trip-route-stay` | Trip Route Stay | ¥580 | 1 | trip-route-stay |
| 10 | `chitamaru-open-close-radar` | Open/Close Radar | ¥580 | 1 | open-close-radar |
| 11 | `chitamaru-comicstay` | ComicStay | ¥980 | 1 | manga-cafe-finder |
| 12 | `chitamaru-my-dartslive` | My Dartslive | ¥2,480 | 1 | my-dartslive |
| 13 | `chitamaru-eki-genre-map` | Eki Genre Map | ¥980 | 1 | eki-genre-map |
| 14 | `chitamaru-content-brief-packs` | Content Brief Packs | ¥580 | 1 | content-brief-engine |
| 15 | `chitamaru-seo-dashboard-agency` | SEO Dashboard Agency | ¥3,800 | 3 | （新規） |
| 16 | `chitamaru-room-ops-tickets` | ROOM Ops Tickets | ¥4,800 | 1 | rakuafi-tool |

作成後の URL: `https://github.com/syunnjack/<repo>`  
Pages: `https://syunnjack.github.io/<repo>/`

## GitHub へ新規作成する

この Cloud Agent のトークンは `createRepository` が **403** です。  
`repo` スコープの PAT を渡すか、Actions（secret `CROSS_REPO_PAT`）を実行してください。

```bash
# ソース生成
python3 products/generate.py

# GitHub に 16 リポを create + push
export GH_TOKEN=ghp_xxxxxxxx   # syunnjack の repo スコープ PAT
chmod +x products/create-github-repos.sh
./products/create-github-repos.sh

# または Actions: Create Chitamaru product GitHub repos
```

既存プロトタイプと同名にはしません。すべて `chitamaru-*` です。

## 再生成

`catalog.json` を直してから:

```bash
python3 products/generate.py
```

各 `products/chitamaru-*/` が独立リポの中身です。rakuten02 に置いているのは **配布用の正本** で、GitHub 側が公開リポです。
