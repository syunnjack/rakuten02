# デプロイ設定（PHP/Laravelランキングサイト群 + golf-search）

2026-08-07〜08、11リポジトリに GitHub Actionsデプロイワークフローを追加し、
**全11リポジトリでCI/CDが動作確認済み**（push → composer/npmビルド → SSH経由rsyncで配置 →
`migrate`/`cache`/コンテンツ同期コマンド、まで自動）。

## ホスト振り分け・接続情報（全て確認・設定済み）

- **アダルト系10件 → ColorfulBOX**（`.github/workflows/deploy-colorfulbox.yml`）
  - Host: `183.90.183.168` / Port: `22` / User: `boewaxno`
  - SSH秘密鍵はこのマシンの `~/.ssh/colorfulbox_sosolu` にあり、全10リポジトリの
    `COLORFULBOX_SSH_KEY` に設定済み
  - PHP: サーバーデフォルトの`php`は7.4のため、`/opt/cpanel/ea-php83/root/usr/bin/php`を明示使用
- **golf-search（一般ジャンル）→ Xserver**（`.github/workflows/deploy-xserver.yml`）
  - アカウント`xs501620`（`goalpilot.jp`と同じ）、Port `10022`
  - SSH鍵は2026-08-03/04に設定済みの既存Secrets（`SSH_HOST`/`SSH_USERNAME`/`SSH_PRIVATE_KEY`）を
    そのまま再利用
  - PHP: サーバーデフォルトは8.0.30のため、`/usr/bin/php8.3`を明示使用

## シンレンタルサーバー（WPXアカウント）接続情報

2026-08-08確認。実体はXserver系列の「wpX」ブランドのアカウント。

- Host: `wp858043.wpx.jp`（別名 `sv6054.wpx.ne.jp`） / Port: `10022` / User: `wp858043`
- SSH秘密鍵: このマシンの `~/.ssh/xserver_wpx`（認証確認済み）
- PHP: サーバーデフォルトは8.0.30。`/usr/bin/php8.1`〜`/usr/bin/php8.4`が利用可能

### 重要な発見: 残り17件のPHPランキングサイトも既にここに手動デプロイ済みだった

`~/app-<repo>-ranking/` 形式で17件全て配置済み、**全てDMM_API_ID等が実際の値で設定済み**
（プレースホルダーではない）。ただし**DNSがまだこのサーバーを向いておらず、外部からアクセス不可**
（ColorfulBOX側は既にライブだったのと対照的）。

| ディレクトリ | ドメイン |
|---|---|
| app-back-piston-ranking | back-piston.jp |
| app-hard-piston-ranking | hard-piston.jp |
| app-kosupure-ranking | kosupure.jp |
| app-kyonyu-ranking | kyonyu.site |
| app-mesuiki-ranking | mesuiki.jp |
| app-mesuochi-ranking | mesuochi.jp |
| app-neback-ranking | neback.jp |
| app-netorare-ranking | netorare.net |
| app-play-inbus-ranking | play-inbus.jp |
| app-play-inplane-ranking | play-inplane.jp |
| app-play-promotionalgirl-ranking | play-with-promotionalgirl.jp |
| app-play-roundgirl-ranking | play-with-roundgirl.jp |
| app-playincar-ranking | playincar.jp |
| app-shibari-ranking | shibari.click |
| app-shirouto-ranking | shirouto.tech |
| app-tachiback-ranking | tachiback.jp |
| app-taimenzai-ranking | taimenzai.jp |

### このアカウントで稼働中の、ranking以外の3サイト（リポジトリ未特定）

`manga-kuchikomi.jp`、`massage-kuchikomi.jp`、`vr-choice.jp`（ホームディレクトリに
`wp858043.wpx.jp`用ディレクトリとは別に確認、詳細未調査）

### 容量に関する注意

ColorfulBOX（22サイト稼働中）・この WPXアカウント（20サイト稼働中）とも、既に相応の数の
サイトを抱えている。新規30サイトを「適切に分散」する際は、プラン容量の確認が必要な可能性がある
（未確認）。

## 重要な発見: アダルト系10件は既にColorfulBOXに手動デプロイ・本番稼働中だった

`boewaxno`アカウントには、`sosolu`/`sosoru`ドメインファミリー全20ドメイン分の
`app-<ドメイン名>`ディレクトリが既に存在し、ランキング10サイト＋他12サイト（下記）が
本番稼働していた。**sosolu/sosoruファミリーに"空きドメイン"は無い。**

実際のドメイン ↔ リポジトリ ↔ デプロイ先パス対応表（2026-08-08確認、Secretsに設定済み）:

| リポジトリ | 本番ドメイン | デプロイ先パス |
|---|---|---|
| adult-comic-ranking | `sosolu.pro` | `/home/boewaxno/app-sosolu-pro` |
| adult-figure-ranking | `sosolu.link` | `/home/boewaxno/app-sosolu-link` |
| adult-novel-ranking | `sosolu.email` | `/home/boewaxno/app-sosolu-email` |
| bl-tl-doujin-ranking | `sosolu.help` | `/home/boewaxno/app-sosolu-help` |
| bl-tl-novel-ranking | `sosolu.org` | `/home/boewaxno/app-sosolu-org` |
| cross-asp-ranking | `sosoru.click` | `/home/boewaxno/app-sosoru-click` |
| duga-video-ranking | `sosoru.tokyo` | `/home/boewaxno/app-sosoru-tokyo` |
| gravure-photo-ranking | `sosolu.net` | `/home/boewaxno/app-sosolu-net` |
| mature-genre-ranking | `sosolu.tokyo` | `/home/boewaxno/app-sosolu-tokyo` |
| r18-anime-ranking | `sosolu.xyz` | `/home/boewaxno/app-sosolu-xyz` |

`sosolu.pro`にアクセスして実際にエロ漫画ランキングが表示されることを確認済み＝**このドメイン群は
既にDNSがColorfulBOXに向いており、ライブ状態**（他の.jp/.site系ドメイン群とは違い、NS反映待ちではない）。

### その他、同アカウントで稼働中の12サイト（ranking以外、リポジトリ未特定）

`sosolu.blog`(doujin-release-calendar) `sosolu.life`(adult-goods-compare)
`sosolu.online`(eroge-release-alert) `sosolu.site`(av-debut-tracker=AVデビュー速報、**触らない**)
`sosolu.space`(subscription-compare) `sosoru.asia`(free-sample-hub)
`sosoru.help`(fanza-sale-watch) `sosoru.link`(mgs-video-guide)
`sosoru.net`(sokmil-new-releases) `sosoru.org`(hey-douga-guide)
`sosoru.shop`(sexy-costume-compare) `sosoru.site`(unlimited-comic-hub)

## ⚠️ インシデント記録（2026-08-08）

デプロイワークフロー初版は `rsync --delete` に `.env` の除外指定が漏れており、かつ空のAPI
キーで`.env`を新規生成するステップがあった。package-lock.json追加のpushが誘発した自動デプロイで、
**3サイトの本番`.env`が空の認証情報で上書きされた**（キャンセルが間に合わなかった）:

- `mature-genre-ranking`（`sosolu.tokyo`）: `DMM_API_ID`/`DMM_AFFILIATE_ID`が空に
- `gravure-photo-ranking`（`sosolu.net`）: 同上
- `duga-video-ranking`（`sosoru.tokyo`）: `DUGA_APP_ID`/`DUGA_AGENT_ID`が空に

サーバー上にバックアップなし。**元のAPI ID値はDMM/DUGAの提携アカウント管理画面から再取得が必要**
（ユーザー確認待ち、2026-08-08時点で未復旧）。表示上はDB内の既存データが残っているため、
現時点では見た目上壊れていないが、次回同期（cron）が空キーで失敗し続ける状態。

原因だった`.env`削除・上書き問題は全10リポジトリで修正済み（`.env`をrsync除外、
CI側での`.env`生成ステップ自体を削除 = サーバー上の既存`.env`をそのまま使う方式に変更）。

## 各リポジトリで設定済み（自動、追加作業不要）

- `APP_KEY`: リポジトリごとに一意な値を生成しSecrets設定済み（ただし実際の本番`.env`は
  サーバー上の既存ファイルがそのまま使われるため、この値は現状未使用）
- `COLORFULBOX_SSH_HOST` / `PORT` / `USER` / `KEY` / `DEPLOY_PATH`: 上記対応表の通り設定済み
- アダルト系10件の`APP_URL`: 上記対応表の通り設定済み
- golf-searchの`APP_URL`: `https://golf-search.org`設定済み
- golf-searchの`XSERVER_DEPLOY_PATH`: `/home/xs501620/golf-search.org/public_html`（推定・未検証、
  Xserver管理画面での`.org`ドメイン登録が前提）

## まだユーザー対応が必要なもの

1. **DMM/DUGA API認証情報の再取得**（上記インシデント参照、最優先）
2. **golf-search.orgのDNS/Xserverドメイン登録**: デプロイ自体は成功済みだが、
   ドメインがまだXserverを指していないため公開URLでアクセスできない
3. 残り12サイト（av-debut-tracker等）のリポジトリ特定・GitHub Actions化は未着手
4. golf-searchの`XSERVER_SSH_HOST`は未確認（`xs501620`アカウントの契約サーバー番号が必要）

## 前提条件（確認済み）

- ColorfulBOX: SSH利用可能（ポート22、パスワード無しの鍵認証）。PHP 8.1〜8.5が`/opt/cpanel/ea-phpXX/`に用意されている
- Xserver（xs501620）: SSH利用可能（ポート10022）。PHP 8.0〜8.4?が`/usr/bin/phpX.Y`に用意されている
- 両方ともSQLite使用、DB接続情報の設定は不要
