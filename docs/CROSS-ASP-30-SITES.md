# 差別化アダルトアフィリエイト30サイト（マルチASP横断比較）

2026-08-08、既存41ランキングサイト・sosolu/sosoruファミリー22サイトと被らない30ジャンルで、
複数ASP（FANZA・DUGA・ソクミル・APEX・MGS動画・SOD・DTICASH）を横断比較する新シリーズを追加。

## アーキテクチャ

`cross-asp-ranking`の`RankedItem`正規化スコア方式をベースに、対応ASPを3→7に拡張。

- `App\Services\DmmClient` / `DugaClient` / `SokmilClient`: 既存3社、`keyword`引数を追加してジャンル別検索に対応
- `App\Services\GenericFeedClient`: APEX・MGS動画・SOD・DTICASH用。各社のAPI/CSV/RSS仕様が
  未確認のため、汎用JSONフィード＋キーワードでのタイトルフィルタという設計にしてある
  （`task-dashboard/scripts/fetch-fanza-data.mjs`と同じ思想）。**実際のフィード形式が分かり次第、
  フィールドマッピング（`GenericFeedClient`の`id()`/`title()`/`maker()`等の静的メソッド）を調整要**
- `App\Console\Commands\SyncGenreCross`（`genre:sync`）: 7ソース全てを`config('genre.keyword')`で
  検索し、`RankedItem`テーブルに正規化スコアとともにupsert
- `config/genre.php`: `.env`の`GENRE_NAME`/`GENRE_KEYWORD`/`GENRE_EYEBROW`で各サイトのジャンルを設定
  （リポジトリごとのコード差分はこの3つの環境変数のみ）
- `robots.txt`/`sitemap.xml`はハードコードせず、`routes/web.php`でドメイン非依存の動的ルートに変更
  （ドメインが後から確定/変更されてもコード修正不要）

## 30ジャンル一覧・ドメイン確定状況

2026-08-08、お名前.comで購入・受付完了。**候補提示時から一部TLDが変更されている
（在庫状況によりお名前.com側で自動的に代替TLDになったもの）。**

| リポジトリ | ジャンル | 検索キーワード | 確定ドメイン |
|---|---|---|---|
| joshidaisei-cross | 女子大生 | 女子大生 | joshidaisei.jp |
| wakazuma-cross | 若妻 | 若妻 | wakazuma.org（候補は.jp） |
| jokyoshi-cross | 女教師 | 女教師 | jokyoshi.jp（候補は.net） |
| nurse-cross | ナース | ナース | nurse-genre.jp |
| hisho-cross | 秘書 | 秘書 | hisho.click（候補は.jp） |
| joshi-ana-cross | 女子アナ | 女子アナ | joshi-ana.net |
| vr-av-cross | VR | VR | vr-douga-hikaku.jp |
| 4k-av-cross | 4K高画質 | 4K | 4k-av.jp |
| best-compilation-cross | 総集編 | 総集編 | best-compilation.click |
| gansha-cross | 顔射 | 顔射 | gansha.jp（`gansha-cross.net`も購入済み、予備ドメイン扱い） |
| nakadashi-cross | 中出し | 中出し | nakadashi.shop（候補は.net） |
| kousoku-sm-cross | 拘束・SM | SM | kousoku-sm.jp |
| swapping-cross | スワッピング | スワッピング | swapping-genre.click |
| roshutsu-cross | 野外露出 | 野外露出 | roshutsu.jp |
| chikan-play-cross | 痴漢 | 痴漢 | chikan-play.net |
| lesbian-cross | レズビアン | レズビアン | lesbian-genre.jp |
| pocchari-cross | ぽっちゃり | ぽっちゃり | pocchari.org（候補は.jp） |
| hinnyu-cross | 貧乳 | 貧乳 | hinnyu.org（候補は.jp） |
| slender-cross | スレンダー | スレンダー | slender-genre.jp |
| bijiri-cross | 美尻 | 美尻 | bijiri.jp |
| ashi-fetish-cross | 脚フェチ | 脚フェチ | ashi-fetish.click |
| panchira-cross | パンチラ | パンチラ | panchira.site（候補は.jp） |
| jk-seifuku-cross | JK制服 | JK | jk-seifuku.net |
| maid-cross | メイド | メイド | maid-genre.jp |
| miko-cross | 巫女 | 巫女 | miko-genre.tech |
| asmr-voice-cross | ASMR | ASMR | asmr-voice.jp |
| doujin-game-cross | 同人ゲーム | 同人ゲーム | doujin-game.click |
| kojin-satsuei-cross | 個人撮影 | 個人撮影 | kojin-satsuei.jp |
| debut-cross | 新人デビュー | 新人 | debut-genre.net |
| intai-archive-cross | 引退作品 | 引退 | intai-archive.jp |

## ホスティング

ユーザー指示: 「シンレンタルサーバー、カラフルBOXと適切に分散」。

- ColorfulBOX（`boewaxno`）: 接続情報確認済み（[XSERVER-DEPLOY.md](./XSERVER-DEPLOY.md)参照）。
  既に22サイト稼働中
- シンレンタルサーバー（WPX、`wp858043`）: 接続情報確認済み。既に17ランキングサイト+3サイト稼働中
  （コード配置済みだがDNS未接続で非公開）
- 30サイトの振り分け（何件ずつどちらに置くか）・両アカウントの容量余地は未確定

## 進行状況

- [x] 共通テンプレート（`_template-multi-asp`）作成・ビルド検証済み
- [x] 30リポジトリ作成・push・APP_KEY設定済み（`syunnjack/<slug>-cross`）
- [x] デプロイワークフロー雛形追加（ColorfulBOX向け、Secrets未設定）
- [x] ドメイン購入完了（30/30）
- [x] 各リポジトリのAPP_URL Secrets設定完了
- [ ] 30サイトのホスト振り分け決定（容量確認後）
- [ ] 各リポジトリのデプロイ先パスSecrets設定
- [ ] 各種APIキー（DMM/DUGA/SOKMIL）・フィードURL（APEX/MGS/SOD/DTICASH）の設定
