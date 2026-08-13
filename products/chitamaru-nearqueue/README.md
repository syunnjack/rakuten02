# NearQueue（受付番号・待ち時間システム）

知多丸の**独立製品リポジトリ**です。既存プロトタイプを商品化するために新規作成しています。

- おすすめ順: **#4**
- Phase: **3**（1=個人買い切り下地 / 2=個人月額 / 3=B2B）
- 価格: 個人 **¥3,800** ／ 月額目安 ¥3,800 ／ B2B 店舗SaaS ¥3,800〜 / 導入 ¥19,800〜
- BOOTH（予定）: https://chitamaru.booth.pm/items/nearqueue
- Pages: https://syunnjack.github.io/chitamaru-nearqueue/
- プロトタイプ: https://github.com/syunnjack/reservation-waiting-time-v1

## 誰向け

美容・飲食・医療など、順番待ちを改善したい店舗

近くの店舗で番号を取り、待ち時間を自分の時間に変える。

## できること

- 来店者の受付番号発行（デモ）
- 待ち組数・目安時間
- スタッフボード（呼び出し／案内済）
- 受付後のクーポン枠

## 開発

```bash
npm install
npm run dev
npm run build
```

GitHub Pages は `base: '/chitamaru-nearqueue/'` です。リポジトリの Pages を GitHub Actions に設定してください。

## 既存リポを上書きしない理由

同名のプロトタイプ（例: `nearqueue`）が既にある場合でも、**商品名・価格・BOOTH導線・Phase 設計を持った製品版**として別リポにしています。

## ブランド

知多丸 / 積み上げログ — https://syunnjack.dev/store
