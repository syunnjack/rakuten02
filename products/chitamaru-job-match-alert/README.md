# Job Match Alert（求人条件一致通知）

知多丸の**独立製品リポジトリ**です。既存プロトタイプを商品化するために新規作成しています。

- おすすめ順: **#2**
- Phase: **1**（1=個人買い切り下地 / 2=個人月額 / 3=B2B）
- 価格: 個人 **¥980** ／ 月額目安 ¥980 ／ B2B 掲載・採用課金 ¥2,480〜
- BOOTH（予定）: https://chitamaru.booth.pm/items/job-match-alert
- Pages: https://syunnjack.github.io/chitamaru-job-match-alert/
- プロトタイプ: https://github.com/syunnjack/job-match-alert

## 誰向け

転職活動を通知で回したい人（新着・締切・面接枠）

希望条件を一度保存すれば、一致した求人だけを追える。

## できること

- 職種・年収・勤務地・リモート条件
- 新着・締切・面接枠の一致表示
- 保存条件のローカル管理
- 後の採用媒体・人材紹介課金へ接続

## 開発

```bash
npm install
npm run dev
npm run build
```

GitHub Pages は `base: '/chitamaru-job-match-alert/'` です。リポジトリの Pages を GitHub Actions に設定してください。

## 既存リポを上書きしない理由

同名のプロトタイプ（例: `job-match-alert`）が既にある場合でも、**商品名・価格・BOOTH導線・Phase 設計を持った製品版**として別リポにしています。

## ブランド

知多丸 / 積み上げログ — https://syunnjack.dev/store
