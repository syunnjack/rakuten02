# Hotel Price Watch（宿泊空室・値下げアラート）

知多丸の**独立製品リポジトリ**です。既存プロトタイプを商品化するために新規作成しています。

- おすすめ順: **#1**
- Phase: **1**（1=個人買い切り下地 / 2=個人月額 / 3=B2B）
- 価格: 個人 **¥980** ／ 月額目安 ¥980 ／ B2B 掲載 ¥2,480〜 / 代理店連携
- BOOTH（予定）: https://chitamaru.booth.pm/items/hotel-price-watch
- Pages: https://syunnjack.github.io/chitamaru-hotel-price-watch/
- プロトタイプ: https://github.com/syunnjack/hotel-price-watch

## 誰向け

出張・旅行で今安い／空いている宿を即取りたい人

エリアと上限金額を保存して、空室と値下げの瞬間を逃さない。

## できること

- エリア・日程・上限金額のウォッチ登録
- 空室・値下げシードの条件一致表示
- 保存ウォッチのローカル管理
- 予約アフィ／有料通知への導線

## 開発

```bash
npm install
npm run dev
npm run build
```

GitHub Pages は `base: '/chitamaru-hotel-price-watch/'` です。リポジトリの Pages を GitHub Actions に設定してください。

## 既存リポを上書きしない理由

同名のプロトタイプ（例: `hotel-price-watch`）が既にある場合でも、**商品名・価格・BOOTH導線・Phase 設計を持った製品版**として別リポにしています。

## ブランド

知多丸 / 積み上げログ — https://syunnjack.dev/store
