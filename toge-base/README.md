# TOGE BASE

峠で、つながる。イニシャルD（アーケード）プレイヤーのための非公式攻略コミュニティです。

本番ドメイン想定: `https://togepass.jp/`

## 主な機能

- ステージ進捗と次の目標を表示するマイガレージ（UGC・ブラウザ保存）
- 峠コース攻略・車種データベース
- 攻略情報、質問、対戦募集のコミュニティ投稿
- 週次アンケート・貢献ランキング
- SEO / AIO / LLMO 向けのメタ、JSON-LD、`robots.txt`、`sitemap.xml`、`llms.txt`

## 開発

```bash
npm install
npm run dev
```

静的書き出し（GitHub Pages）:

```bash
npm run build:pages
```

テスト:

```bash
npm test
```

## SEO / AIO / LLMO

| 項目 | パス |
|------|------|
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |
| LLM向け要約 | `/llms.txt` |
| サイトについて | `/about` |
| プライバシー | `/privacy` |
| 利用規約 | `/terms` |
| 広告表記 | `/affiliate-disclosure` |
| 攻略LP | `/guides/*` |

詳細は [docs/SEO-AIO-LLMO.md](docs/SEO-AIO-LLMO.md) を参照してください。

## 環境変数（任意）

| 変数 | 用途 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | canonical / OGP のベースURL（既定: `https://togepass.jp`） |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 測定ID（未設定時はタグ非出力） |
| `NEXT_PUBLIC_SUPPORT_URL` | サポーター登録URL |
| `NEXT_PUBLIC_GEAR_AFFILIATE_URL` | ギア紹介アフィリエイトURL |
| `NEXT_PUBLIC_PARTNER_URL` | 店舗掲載相談URL |

## デプロイ

GitHub Pages（`public/CNAME` = `togepass.jp`）:

1. 本リポジトリを GitHub に作成・push
2. Settings → Pages で GitHub Actions を有効化
3. `main`（またはデプロイブランチ）へ push で `.github/workflows/deploy-pages.yml` が動く
4. DNS で `togepass.jp` を GitHub Pages に向ける

## 権利表記

本プロジェクトはファンによる非公式コミュニティサイトです。ゲームメーカーおよび権利者各社とは関係ありません。ゲーム名、車名、商標等は各権利者に帰属します。
