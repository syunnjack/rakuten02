# Xserverデプロイ設定（PHP/Laravelランキングサイト群）

2026-08-07、以下11リポジトリに `.github/workflows/deploy-xserver.yml` を追加した。
push (デフォルトブランチ) 時に、composer/npm ビルド → SSH経由rsyncでXserverへ配置 →
`migrate`/`cache`/コンテンツ同期コマンドを実行する。

対象リポジトリと同期コマンド:

| リポジトリ | 同期コマンド | Cron分（毎時） |
|---|---|---|
| adult-comic-ranking | `comics:sync` | 5 |
| adult-figure-ranking | `figures:sync` | 10 |
| adult-novel-ranking | `novels:sync` | 15 |
| bl-tl-doujin-ranking | `doujin:sync` | 20 |
| bl-tl-novel-ranking | `novels:sync` | 25 |
| cross-asp-ranking | `cross:sync` | 30 |
| duga-video-ranking | `duga:sync` | 35 |
| gravure-photo-ranking | `photos:sync` | 40 |
| mature-genre-ranking | `genre:sync` | 45 |
| r18-anime-ranking | `anime:sync` | 50 |
| golf-search | （同期コマンドなし） | - |

## 各リポジトリで設定済み（自動）

- `APP_KEY`: リポジトリごとに一意な値をこちらで生成し、GitHub Secretsに設定済み。追加作業不要。

## 各リポジトリで設定が必要（ユーザー側、未設定）

お名前.comやXserver管理画面へのアクセス、DMM/DUGA/Sokmilの提携APIキーはこちらから取得できないため、
以下は各リポジトリの `Settings > Secrets and variables > Actions` で手動設定が必要。

**Xserver接続情報（11リポジトリ共通の値になるはず。同一Xserverアカウントなら使い回し可）:**

- `XSERVER_SSH_HOST`: XserverのSSHホスト名（例: `svXXXX.xserver.jp`）
- `XSERVER_SSH_PORT`: XserverのSSHポート（Xserverは`10022`が一般的だが要確認）
- `XSERVER_SSH_USER`: SSHユーザー名
- `XSERVER_SSH_KEY`: SSH秘密鍵（PEM形式）。Xserver側に対応する公開鍵の登録が必要
- `XSERVER_DEPLOY_PATH`: リポジトリごとに異なる。デプロイ先ディレクトリ（例: `/home/xsXXXXXX/kyonyu.site/public_html`）

**アプリ固有の値（リポジトリごとに異なる）:**

- `APP_URL`: 本番ドメイン（例: `https://adult-comic.jp` ※実際のドメイン名は未確定、[RANKING-SITES.md](./RANKING-SITES.md)参照）

**API認証情報（対象リポジトリのみ。用途は各リポジトリの`config/services.php`参照）:**

- `DMM_API_ID` / `DMM_AFFILIATE_ID`: DMMアフィリエイトAPIを使う全リポジトリ（duga-video-ranking以外の10件）
- `DUGA_APP_ID` / `DUGA_AGENT_ID`: duga-video-ranking, cross-asp-ranking
- `SOKMIL_API_KEY` / `SOKMIL_AFFILIATE_ID`: cross-asp-rankingのみ
- `GA4_MEASUREMENT_ID`: 任意（未設定でも動作する）

golf-searchはDMM/DUGA/Sokmil関連のsecretは不要（`APP_URL`と`XSERVER_*`のみ）。

## 前提条件

- Xserver側でSSH接続が有効になっていること（Xserverのプランによっては別途SSH有効化が必要）
- `XSERVER_DEPLOY_PATH` のドキュメントルート自体は事前にXserver管理画面でドメイン設定済みであること
- PHP 8.3以上、SQLite拡張が有効なこと

## 未確定事項

- 上記10ランキングサイトの実際のドメイン名（`sitemap.xml`に記載されている `*.jp` / `*.site` / `*.net` / `*.tech` / `*.click` 等が実際に登録済みか未確認。[RANKING-SITES.md](./RANKING-SITES.md)参照）
- golf-searchの正式ドメイン名（`.org`にする方針とだけ聞いている、具体名未確認）
