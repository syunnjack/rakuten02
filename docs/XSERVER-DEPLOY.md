# デプロイ設定（PHP/Laravelランキングサイト群 + golf-search）

2026-08-07、以下11リポジトリに GitHub Actionsデプロイワークフローを追加した。
push (デフォルトブランチ) 時に、composer/npm ビルド → SSH経由rsyncでサーバへ配置 →
`migrate`/`cache`/コンテンツ同期コマンドを実行する。

## ホスト振り分け

- **アダルト系10件 → ColorfulBOX**（`.github/workflows/deploy-colorfulbox.yml`）
- **golf-search（一般ジャンル）→ Xserver**（`.github/workflows/deploy-xserver.yml`）

（当初アダルト系もXserver向けに作ってしまったが誤り。Xserverは一般ジャンル、
アダルト系はシンレンタルサーバー/カラフルBOXに振り分ける方針とのことで、
今回は指示によりアダルト系10件は全てColorfulBOXに統一した。）

対象リポジトリと同期コマンド:

| リポジトリ | ホスト | 同期コマンド | Cron分（毎時） |
|---|---|---|---|
| adult-comic-ranking | ColorfulBOX | `comics:sync` | 5 |
| adult-figure-ranking | ColorfulBOX | `figures:sync` | 10 |
| adult-novel-ranking | ColorfulBOX | `novels:sync` | 15 |
| bl-tl-doujin-ranking | ColorfulBOX | `doujin:sync` | 20 |
| bl-tl-novel-ranking | ColorfulBOX | `novels:sync` | 25 |
| cross-asp-ranking | ColorfulBOX | `cross:sync` | 30 |
| duga-video-ranking | ColorfulBOX | `duga:sync` | 35 |
| gravure-photo-ranking | ColorfulBOX | `photos:sync` | 40 |
| mature-genre-ranking | ColorfulBOX | `genre:sync` | 45 |
| r18-anime-ranking | ColorfulBOX | `anime:sync` | 50 |
| golf-search | Xserver | （同期コマンドなし） | - |

## golf-searchについて判明した事実

`golf-search`リポジトリに2026-08-01時点で既存のデプロイワークフローがあり、以下が確認できた
（今回、より完全なワークフローに置き換えたため削除したが、値はここに転記）:

- **Xserverアカウント: `xs501620`**（`goalpilot.jp`と同じアカウント）
- **SSHポート: `10022`**
- 旧設定のデプロイ先: `/home/xs501620/golf-search.jp/public_html/`（ドメインは`.jp`だった）

ユーザーの直近の指示で golf-search は `.org` に変更する方針とのこと。旧workflowは
`public/`のみをSFTPでアップロードするだけで、composer install・.env生成・DBマイグレーションを
一切行っておらず、実際には動作するLaravelアプリとしてデプロイできていなかった（不完全な雛形）。

## 各リポジトリで設定済み（自動）

- `APP_KEY`: リポジトリごとに一意な値をこちらで生成し、GitHub Secretsに設定済み。追加作業不要。

## 各リポジトリで設定が必要（ユーザー側、未設定）

お名前.com、Xserver/ColorfulBOX管理画面へのアクセス、DMM/DUGA/Sokmilの提携APIキーはこちらから
取得できないため、以下は各リポジトリの `Settings > Secrets and variables > Actions` で手動設定が必要。

**golf-search（Xserver、アカウントxs501620と分かっているので実質ポート/ユーザー以外は埋まる）:**

- `XSERVER_SSH_HOST`: 例 `sv****.xserver.jp`（xs501620アカウントの契約サーバー番号）
- `XSERVER_SSH_PORT`: `10022`（旧workflowで確認済み）
- `XSERVER_SSH_USER`: `xs501620`
- `XSERVER_SSH_KEY`: SSH秘密鍵（PEM形式）。Xserver側に対応する公開鍵の登録が必要
- `XSERVER_DEPLOY_PATH`: ドメインを`.org`にする場合、Xserver管理画面で新規ドメイン設定後のパス（例 `/home/xs501620/golf-search.org/public_html`）
- `APP_URL`: 本番ドメイン（`.org`の具体名は未確認）

**アダルト系10件（ColorfulBOX、共通の値になるはず）:**

- `COLORFULBOX_SSH_HOST` / `COLORFULBOX_SSH_PORT` / `COLORFULBOX_SSH_USER` / `COLORFULBOX_SSH_KEY`
- `COLORFULBOX_DEPLOY_PATH`: リポジトリごとに異なる
- `APP_URL`: 本番ドメイン（`sitemap.xml`記載の`*.jp`/`*.site`/`*.net`/`*.tech`/`*.click`等が実際に登録済みか未確認、[RANKING-SITES.md](./RANKING-SITES.md)参照）

**API認証情報（対象リポジトリのみ。用途は各リポジトリの`config/services.php`参照）:**

- `DMM_API_ID` / `DMM_AFFILIATE_ID`: DMMアフィリエイトAPIを使う全リポジトリ（duga-video-ranking以外の9件）
- `DUGA_APP_ID` / `DUGA_AGENT_ID`: duga-video-ranking, cross-asp-ranking
- `SOKMIL_API_KEY` / `SOKMIL_AFFILIATE_ID`: cross-asp-rankingのみ
- `GA4_MEASUREMENT_ID`: 任意（未設定でも動作する）

## 前提条件

- 対象サーバでSSH接続が有効になっていること（プランによっては別途SSH有効化が必要。
  ColorfulBOXのSSH対応状況は未確認）
- デプロイ先ドキュメントルートは事前に管理画面でドメイン設定済みであること
- PHP 8.3以上、SQLite拡張が有効なこと

## 未確定事項

- 上記10ランキングサイトの実際のドメイン名（登録済みか未確認）
- golf-searchの`.org`の具体的なドメイン名
- ColorfulBOXのSSH対応可否・接続情報
