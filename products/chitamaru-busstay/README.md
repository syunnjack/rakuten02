# BusStay（バス到着後の宿探し）

知多丸の**独立製品リポジトリ**です。既存プロトタイプを商品化するために新規作成しています。

- おすすめ順: **#8**
- Phase: **1**（1=個人買い切り下地 / 2=個人月額 / 3=B2B）
- 価格: 個人 **¥980** ／ 月額目安 データPro ¥980 ／ B2B 掲載 ¥2,480〜
- BOOTH（予定）: https://chitamaru.booth.pm/items/busstay
- Pages: https://syunnjack.github.io/chitamaru-busstay/
- プロトタイプ: https://github.com/syunnjack/bus-arrival-guide

## 誰向け

高速バス到着後に近い宿を即探したい人

到着バスターミナルから徒歩圏の宿だけを出す。

## できること

- 到着地点の選択
- 徒歩分数での絞り込み
- 今夜空きシード
- 宿泊予約アフィ導線

## 開発

```bash
npm install
npm run dev
npm run build
```

GitHub Pages は `base: '/chitamaru-busstay/'` です。リポジトリの Pages を GitHub Actions に設定してください。

## 既存リポを上書きしない理由

同名のプロトタイプ（例: `busstay`）が既にある場合でも、**商品名・価格・BOOTH導線・Phase 設計を持った製品版**として別リポにしています。

## ブランド

知多丸 / 積み上げログ — https://syunnjack.dev/store
