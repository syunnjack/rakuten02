# 生成AI活用30サイト

2026-08-08、Anthropic Claude APIを使った4つのアーキタイプ＋メタポータル1件で、
30サイト分のリポジトリを作成・push・Secrets設定済み。

## アーキタイプ（実質4種類 + ポータル1種類）

30サイトを6系統として提案したが、実装可能な単位に整理すると以下4テンプレート:

- **Template A（AI要約ダイジェスト）**: `_template-ai-summary` — 複数ASPからアイテムを取得し、
  上位アイテムについてClaudeが紹介文を自動生成。`app:sync`コマンド（1時間毎cron想定）。14サイト
- **Template B（AI診断クイズ）**: `_template-ai-diagnosis` — 3問の固定クイズに回答すると、
  Claudeが好みを分析しキーワード抽出→DMM検索→結果表示。ステートレス（DB不要）。7サイト
- **Template C（AIチャット検索）**: `_template-ai-chat` — 自然文入力→Claudeがキーワード抽出→
  DMM検索→結果表示。Template Bの自由入力版。7サイト
- **Template D（AI画像解析検索）**: `_template-ai-vision` — Claude Vision APIでサムネイル画像を
  解析しタグ生成、タグで絞り込み検索。1サイト（thumbnail-ai-search）
- **ポータル**: `_template-ai-portal` — 他29サイトへのリンク集（DB・AI呼び出しなし）。1サイト

## 共通コンポーネント

- `App\Services\AiClient`: Anthropic Messages APIラッパー。`ask()`/`askJson()`/`askAboutImage()`
  （Vision）。`ANTHROPIC_API_KEY`未設定時は全メソッドが`null`を返し、呼び出し側は「準備中」表示に
  フォールバックする設計（DMM/DUGA等の既存クライアントと同じパターン）
- ASP系クライアント（Dmm/Duga/Sokmil/GenericFeed）は`cross-asp`シリーズと共通のものを流用

## 30サイト一覧・ドメイン（購入済み）

| リポジトリ | テンプレート | ドメイン |
|---|---|---|
| ai-portal-shindan | portal | ai-portal-shindan.jp |
| review-digest-ai | A | review-digest-ai.jp |
| arasuji-ai | A | arasuji-ai.net |
| emotion-ranking-ai | A | emotion-ranking-ai.jp |
| ranking-kaisetsu-ai | A | ranking-kaisetsu-ai.click |
| weekly-ai-news | A | weekly-ai-news.jp |
| monthly-best-ai | A | monthly-best-ai.net |
| ai-price-yosoku | A | ai-price-yosoku.jp |
| trend-yosoku-ai | A | trend-yosoku-ai.click |
| ai-shinjin-hakken | A | ai-shinjin-hakken.jp |
| recommend-hikaku-ai | A | recommend-hikaku-ai.net |
| voice-digest-ai | A | voice-digest-ai.jp |
| koeshitsu-ai | A | koeshitsu-ai.click |
| ai-interview-kiji | A | ai-interview-kiji.net |
| ai-365-calendar | A | ai-365-calendar.net |
| ai-shindan | B | ai-shindan.org |
| mood-ai-genre | B | mood-ai-genre.click |
| chara-shindan-ai | B | chara-shindan-ai.jp |
| custom-shindan-ai | B | custom-shindan-ai.net |
| personal-curator-ai | B | personal-curator-ai.jp |
| shicho-analytics-ai | B | shicho-analytics-ai.click |
| ai-playlist | B | ai-playlist.click |
| scene-ai-search | C | scene-ai-search.jp |
| situation-ai | C | situation-ai.net |
| similar-work-ai | C | similar-work-ai.click |
| ai-soudan-shitsu | C | ai-soudan-shitsu.jp |
| dochira-ai | C | dochira-ai.net |
| sakufu-ai-bunrui | C | sakufu-ai-bunrui.jp |
| text-search-ai | C | text-search-ai.jp |
| thumbnail-ai-search | D | thumbnail-ai-search.jp |

## 各リポジトリで設定済み（自動）

- `APP_KEY`: 一意な値を生成・設定済み
- `APP_URL`: 上記ドメイン設定済み

## まだ必要なもの

1. **`ANTHROPIC_API_KEY`**（最重要・全サイト共通） — これが無いと全サイトのAI機能が
   「準備中」表示のまま動かない
2. DMM/DUGA/SOKMILのAPIキー、APEX/MGS/SOD/DTICASHのフィードURL（Template A/B/C/Dが
   コンテンツ取得に使用。cross-asp30サイトと同じもの流用可）
3. ホスティング先の決定・デプロイ（未着手）。ColorfulBOX/シンレンタルサーバーとも既存30サイトが
   既に稼働中のため、容量再確認してから振り分ける想定
4. デプロイワークフロー（`.github/workflows/`）は未追加。cross-asp30サイトの`deploy-colorfulbox.yml`
   /`deploy-wpx.yml`パターンを流用予定だが、WPX側はGitHub ActionsからのSSHがブロックされる問題が
   未解決のまま（[XSERVER-DEPLOY.md](./XSERVER-DEPLOY.md)参照）

## 既知の環境上の注意

このセッションのローカル作業ディレクトリがOneDrive同期フォルダ内にあり、`composer install`中に
OneDriveの同期処理とファイル書き込みが競合し、`vendor/`が壊れる/消えることが複数回発生した。
30リポジトリの本体コードはpush前に構文チェック（`php -l`）のみで検証し、実際の`composer install`
はサーバー側（本番環境）でのみ実行する方針に切り替えた。
