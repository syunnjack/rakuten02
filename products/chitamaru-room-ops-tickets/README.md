# ROOM Ops Tickets（楽天ROOM 週次改善チケット）

知多丸の**独立製品リポジトリ**です。既存プロトタイプを商品化するために新規作成しています。

- おすすめ順: **#16**
- Phase: **1**（1=個人買い切り下地 / 2=個人月額 / 3=B2B）
- 価格: 個人 **¥4,800** ／ 月額目安 週次継続は要見積 ／ B2B 法人運用パッケージ
- BOOTH（予定）: https://chitamaru.booth.pm/items/room-ops-tickets
- Pages: https://syunnjack.github.io/chitamaru-room-ops-tickets/
- プロトタイプ: https://github.com/syunnjack/rakuafi-tool

## 誰向け

ROOMツール購入者で、投稿の差し替えを任せたい人

週次で投稿・差し替えを1チケットずつ頼める。

## できること

- 改善チケットの申込フォーム
- 作業範囲のチェックリスト
- 見積が立てやすい1回 ¥4,800
- ROOMツールへのアップセル

## 開発

```bash
npm install
npm run dev
npm run build
```

GitHub Pages は `base: '/chitamaru-room-ops-tickets/'` です。リポジトリの Pages を GitHub Actions に設定してください。

## 既存リポを上書きしない理由

同名のプロトタイプ（例: `room-ops-tickets`）が既にある場合でも、**商品名・価格・BOOTH導線・Phase 設計を持った製品版**として別リポにしています。

## ブランド

知多丸 / 積み上げログ — https://syunnjack.dev/store
