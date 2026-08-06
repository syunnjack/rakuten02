# Xserver アカウント横断調査

調査日: 2026-08-06　対象: `sites.config.json` 記載の5リポジトリ（本番ドメイン運用中）

前セッション（Cursor側 `bc-99c6dccd-...`）が「Prompt is too long」でフリーズしたため、
Claude Code セッションで引き継いで再調査した結果です。

## 結論

**Xserver を実際にホスティングで使っているのは goalpilot.jp のみ**です。

| リポジトリ | ドメイン | Xserver 使用 | 根拠 |
|------------|----------|:---:|------|
| **goal-pilot-app** | goalpilot.jp | ✅ **xs501620** | `.github/workflows/deploy.yml`: rsync先パス `/home/xs501620/goalpilot.jp/public_html/`、SSHポート10022 |
| kousokubus-benri | busselect.jp | ❌ | `.openai/hosting.json` + README: **OpenAI Site Creator（vinext / Cloudflare Workers）**。既存ドキュメントの「Site Creator DNS」はこのOpenAI製品を指しており、Xserverの同名製品（サイトクリエイター）とは無関係 |
| task-dashboard | darekore.jp | ❌ | GitHub Pages（vite-github-pages） |
| machi-list | machi-list.jp | ❌ | GitHub Pages / Render（static-render） |
| rakuafi-tool | — | ❌ | GitHub Pages、独自ドメイン未割当 |

## goalpilot.jp の詳細（唯一のXserverアカウント）

- アカウントID: **`xs501620`**
- 接続: GitHub Actions → `rsync` over SSH（ポート `10022`）
- Secrets: `SSH_PRIVATE_KEY` / `SSH_HOST` / `SSH_USERNAME`（`syunnjack/goal-pilot-app` リポジトリのGitHub Secrets）
- デプロイ先: `/home/xs501620/goalpilot.jp/public_html/`

## 未解決: 旧(所在不明)アカウント phg28776 / phrr806413

上記5リポジトリのコード・ドキュメント・deploy設定のいずれにも **一致なし**。
GitHub上に痕跡が残っていない＝どのリポジトリにも紐づいていない可能性が高いです。

これ以上リポジトリを横断検索しても見つかる可能性は低く（このため前回セッションが
222リポジトリ全件を検索しようとして「Prompt is too long」でフリーズしたと考えられます）、
次の一次情報源で直接確認するのが確実です。

1. **Xserverビジネス/アカウント管理画面**（https://secure.xserver.ne.jp/xapanel/）に
   `phg28776` / `phrr806413` でログインを試し、契約中サーバー・ドメイン一覧を確認
2. 見つかった場合、そこに設定されているドメインを `sites.config.json` の該当行と突き合わせ
3. 契約が不要なら解約、必要なら `xs501620` への統合を検討

## 訂正が必要だった既存ドキュメント

以下は「Site Creator DNS」という表記がXserverと誤解されやすかったため、
「OpenAI Site Creator（Xserverではない）」と明記するよう修正しました。

- `docs/HANDOFF.md`
- `docs/SITE-ROLLOUT.md`
- `patches/STATUS.md`
- `scripts/site-analytics/sites.config.json`
