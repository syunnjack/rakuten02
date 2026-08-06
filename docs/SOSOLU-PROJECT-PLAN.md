# sosolu.site — 差別化アダルトアフィリエイトサイト 設計方針

2026-08-06 作成。旧セッション（Codex/Cursor等）でのビルドが「Prompt is too long」等でフリーズし、
GitHubにも一度もpushされていなかった（ローカルにのみ存在、リポジトリ自体が見つからず）ため、
このドキュメントを起点に再着手する。

## 保有ドメイン（お名前.com、2027/06/02更新・残300日）

**sosolu系（12件）:** site, link, blog, online, life, space, email, pro, xyz, tokyo, shop, help
**sosoru系（8件）:** site, me, link, life, pro, email, tokyo, shop

主ドメイン候補: **sosolu.site**（第一候補。`.link`をSNS誘導用、`.blog`をコンテンツ用に転用可能）

## 差別化の方向性（既存41ランキングサイトとの違い）

既存の41サイトは「DMM/FANZA系ジャンル別ランキング比較」の量産型。sosoluは以下で差別化:

1. **UGC（ユーザー生成コンテンツ）** — レビュー・評価・投稿機能を持たせ、静的ランキングだけでなく
   ユーザー参加型のコンテンツ層を作る（既存41サイトには無い要素）
2. **AIO/LLMO最適化** — ChatGPT/Perplexity等のAI検索エンジンに引用されやすい構造化データ・
   Q&A形式コンテンツ・`llms.txt`を最初から組み込む（`docs/SEO-AIO-LLMO.md`のshudenhotel事例を踏襲）
3. **複数ドメインの役割分担** — `.site`をメインサイト、`.blog`を長文コンテンツ/SEO記事、
   `.link`をSNS用の短縮導線として使い分け、内部リンクで評価を集約

## 技術スタック（41サイトの実測パターンを流用）

| 要素 | 選択 | 理由 |
|------|------|------|
| フレームワーク | Astro（SSR、`@astrojs/vercel`） | 41サイト中15件で実績あり、UGC機能はServer Endpointsで追加可能 |
| デプロイ先 | Vercel | コード変更不要、既存パターンと統一 |
| UGCデータ保存 | Vercel Postgres or 外部DB | レビュー投稿・評価の永続化用（要決定） |
| AIO/LLMO対応 | `llms.txt`、JSON-LD、Q&A構造化データ | shudenhotel事例（`docs/SEO-AIO-LLMO.md`）を踏襲 |

## 次のステップ

1. GitHubに新規リポジトリを作成（例: `syunnjack/sosolu-site`）
2. Astroベースの初期スキャフォールドを作成（41サイトのAstroテンプレートを流用）
3. UGC機能（レビュー投稿）の設計
4. AIO/LLMO要素（`llms.txt`、構造化データ）を組み込み
5. `sosolu.site`をVercelにデプロイし、DNS設定

## 未確定事項（ユーザー判断待ち）

1. サイトの具体的なジャンル・切り口（既存41件との重複を避ける差別化ポイントの詳細）
2. UGC機能の範囲（レビューのみか、投稿・ランキング投票まで含めるか）
3. リポジトリ名
4. 旧フリーズ作業で既に決まっていた仕様があれば（覚えている範囲で）反映
