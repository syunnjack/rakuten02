# 差別化アダルトアフィリエイト30サイト（マルチASP横断比較）

2026-08-08、既存41ランキングサイト・sosolu/sosoruファミリー12サイトと被らない30ジャンルで、
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

## 30ジャンル一覧・ドメイン候補

ユーザーがお名前.comで購入予定（このセッションからは購入不可）。

| リポジトリ | ジャンル | 検索キーワード | ドメイン候補 |
|---|---|---|---|
| joshidaisei-cross | 女子大生 | 女子大生 | joshidaisei.site |
| wakazuma-cross | 若妻 | 若妻 | wakazuma.jp |
| jokyoshi-cross | 女教師 | 女教師 | jokyoshi.net |
| nurse-cross | ナース | ナース | nurse-genre.click |
| hisho-cross | 秘書 | 秘書 | hisho.pro |
| joshi-ana-cross | 女子アナ | 女子アナ | joshi-ana.xyz |
| vr-av-cross | VR | VR | vr-av.tech |
| 4k-av-cross | 4K高画質 | 4K | 4k-av.info |
| best-compilation-cross | 総集編 | 総集編 | best-compilation.online |
| gansha-cross | 顔射 | 顔射 | gansha.shop |
| nakadashi-cross | 中出し | 中出し | nakadashi.space |
| kousoku-sm-cross | 拘束・SM | SM | kousoku-sm.link |
| swapping-cross | スワッピング | スワッピング | swapping-genre.blog |
| roshutsu-cross | 野外露出 | 野外露出 | roshutsu.help |
| chikan-play-cross | 痴漢 | 痴漢 | chikan-play.life |
| lesbian-cross | レズビアン | レズビアン | lesbian-genre.me |
| pocchari-cross | ぽっちゃり | ぽっちゃり | pocchari.asia |
| hinnyu-cross | 貧乳 | 貧乳 | hinnyu.jp |
| slender-cross | スレンダー | スレンダー | slender-genre.site |
| bijiri-cross | 美尻 | 美尻 | bijiri.net |
| ashi-fetish-cross | 脚フェチ | 脚フェチ | ashi-fetish.click |
| panchira-cross | パンチラ | パンチラ | panchira.pro |
| jk-seifuku-cross | JK制服 | JK | jk-seifuku.xyz |
| maid-cross | メイド | メイド | maid-genre.tech |
| miko-cross | 巫女 | 巫女 | miko-genre.info |
| asmr-voice-cross | ASMR | ASMR | asmr-voice.online |
| doujin-game-cross | 同人ゲーム | 同人ゲーム | doujin-game.shop |
| kojin-satsuei-cross | 個人撮影 | 個人撮影 | kojin-satsuei.space |
| debut-cross | 新人デビュー | 新人 | debut-genre.link |
| intai-archive-cross | 引退作品 | 引退 | intai-archive.blog |

## ホスティング

ユーザー指示: 「シンレンタルサーバー、カラフルBOXと適切に分散」。

- ColorfulBOX（`boewaxno`）: 接続情報確認済み（[XSERVER-DEPLOY.md](./XSERVER-DEPLOY.md)参照）。
  ただし既存アカウントに10サイト+他12サイト稼働中のため、容量・アカウント制限の確認が必要
- シンレンタルサーバー: **接続情報未取得**。SSH可否・ホスト名・ポート・cPanelユーザー名等が必要
- 30サイトの振り分け（何件ずつどちらに置くか）は未確定

## 進行状況

- [x] 共通テンプレート（`_template-multi-asp`、ローカルのみ・未push）作成
- [ ] テンプレートのビルド検証（composer install実行中）
- [ ] 30リポジトリ作成・push
- [ ] デプロイワークフロー（ホスト未確定のため、まずColorfulBOX向けを仮設定）
- [ ] シンレンタルサーバー接続情報の取得
- [ ] 各種APIキー（DMM/DUGA/SOKMIL）・フィードURL（APEX/MGS/SOD/DTICASH）の設定
