# TOGE BASE — SEO / AIO / LLMO / UGC

## ドメイン・指名検索

- 本番URL: `https://togepass.jp/`
- サービス名: TOGE BASE
- 狙いワード: `TOGE BASE`、`トウゲベース`、`イニシャルD 攻略 コミュニティ`、`秋名山 攻略`、`碓氷峠 攻略`

## 基本方針

Google の AI Overview / AI Mode、および LLM 引用向けに「隠しテクニック」より通常SEOの基礎を強くする。

- インデックス可能な静的HTMLを返す（`output: "export"`）
- 重要情報を画像ではなく本文テキストにする
- title / description / canonical をページ意図ごとに分ける
- JSON-LD は画面上の表示内容と一致させる
- アフィリエイトリンクは `rel="nofollow sponsored noopener"`

## 実装済み

| 施策 | 内容 |
|------|------|
| メタ | title, description, keywords, robots, canonical |
| OGP / Twitter | `/og.svg` |
| JSON-LD | WebSite / Organization / FAQPage / Article / BreadcrumbList |
| robots.txt | 一般クローラ + 主要AIクローラ Allow、Sitemap明示 |
| sitemap.xml | トップ・ガイド・法務・llms.txt |
| llms.txt | LLM向けサイト要約と主要URL |
| 法務 | about / privacy / terms / affiliate-disclosure |
| 攻略LP | akina / usui / irohazaka / happogahara / beginner-cars |
| 設置店舗 | `/arcades` + 47都道府県ページ（ALL.Net由来の参考リスト） |
| UGC | マイガレージ・投稿・投票（localStorage） |

## 狙う検索意図

### コース系

- イニシャルD 秋名山 攻略
- 碓氷峠 ヘアピン 攻略
- いろは坂 攻略 アーケード
- 八方ヶ原 攻略

### 車種系

- イニシャルD 初心者 おすすめ車種
- AE86 アーケード 攻略
- EG6 初心者

### 店舗系

- イニシャルD 設置店舗
- イニシャルD ゲームセンター 東京
- 頭文字D THE ARCADE ゲーセン 大阪
- イニシャルD 筐体 近く

### コミュニティ系

- イニシャルD 対戦募集
- イニシャルD 攻略 掲示板

## UGC（ユーザー生成コンテンツ）

- マイガレージ: ランク / ステージ / 車種 / 練習峠
- 投稿: 攻略情報・質問・対戦募集・店舗情報
- 週次アンケートと貢献ランキング
- 保存先は `toge-base.*` キーの localStorage（サーバー不要）

## 公開後チェック

1. `https://togepass.jp/` が 200
2. `/robots.txt` に Sitemap
3. `/sitemap.xml` のホストが `togepass.jp`
4. `/llms.txt` が読める
5. `/affiliate-disclosure` が読める
6. Search Console にプロパティ登録・sitemap送信
7. （任意）`NEXT_PUBLIC_GA_MEASUREMENT_ID` を設定
