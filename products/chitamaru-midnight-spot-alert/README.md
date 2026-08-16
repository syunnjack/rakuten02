# Midnight Spot Alert（終電後スポット通知）

知多丸の**独立製品リポジトリ**です。既存プロトタイプを商品化するために新規作成しています。

- おすすめ順: **#6**
- Phase: **1**（1=個人買い切り下地 / 2=個人月額 / 3=B2B）
- 価格: 個人 **¥580** ／ 月額目安 ¥580 ／ B2B 飲食・宿泊の掲載課金
- BOOTH（予定）: https://chitamaru.booth.pm/items/midnight-spot-alert
- Pages: https://syunnjack.github.io/chitamaru-midnight-spot-alert/
- プロトタイプ: https://github.com/syunnjack/midnight-spot-alert

## 誰向け

終電後の休憩／食事／仮眠を探す人

終電を逃した夜に、休憩・食事・仮眠の候補をすぐ出す。

## できること

- 駅・種別（休憩／食事／仮眠）
- 終電後スポットのシード検索
- ウォッチ保存
- 終電ホテルへの送客

## 開発

```bash
npm install
npm run dev
npm run build
```

GitHub Pages は `base: '/chitamaru-midnight-spot-alert/'` です。リポジトリの Pages を GitHub Actions に設定してください。

## 既存リポを上書きしない理由

同名のプロトタイプ（例: `midnight-spot-alert`）が既にある場合でも、**商品名・価格・BOOTH導線・Phase 設計を持った製品版**として別リポにしています。

## ブランド

知多丸 / 積み上げログ — https://syunnjack.dev/store
