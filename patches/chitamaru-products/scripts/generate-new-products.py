#!/usr/bin/env python3
"""Generate ~70 Chitamaru product repos (scaffolds) + store catalog TypeScript."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPOS = ROOT / "repos"
CATALOG = ROOT / "catalog"
STORE_GEN = ROOT / "store-products.generated.ts"

# recommend_rank order = shortlist first, then ★ desc within remaining
# kind: tool | template | guide | monthly | b2b | content
PRODUCTS: list[dict] = [
    # —— 優先ショートリスト ——
    dict(rank=1, id="A10", slug="zero-conversion-sheet", title="クリックはあるのに成果ゼロ診断シート",
         price="¥480", form="B", category="affiliate", kind="template", emoji="🩺",
         badge="スプレッドシート 買い切り", sublabel="ROOM・ASP成果の切り分け",
         desc="クリックはあるのに成果が出ないとき、リンク・投稿・商品・ROOM側のどこが弱いかをチェック項目で切り分ける診断シートです。",
         features=["チェック項目で原因を言語化", "ROOM/ブログ両対応", "CSV取込前の事前診断に最適", "購入後すぐコピーして利用"]),
    dict(rank=2, id="A5", slug="rakuten-sale-eve-checklist", title="楽天スーパーセール前夜チェックリスト",
         price="¥380", form="B", category="affiliate", kind="guide", emoji="🛒",
         badge="チェックリスト 買い切り", sublabel="セール前にやることを1枚で",
         desc="スーパーセール前夜にやる投稿・リンク・在庫・導線の確認項目をまとめた実践チェックリストです。",
         features=["セール前の必須チェック", "ROOM/ブログ両対応", "季節ごとに使い回し可能", "PDF/Markdown同梱"]),
    dict(rank=3, id="G6", slug="affiliate-disclosure-generator", title="アフィ開示文・PR表記ジェネレータ",
         price="¥280", form="B", category="content", kind="tool", emoji="⚖️",
         badge="Webツール 買い切り", sublabel="表記漏れを防ぐ一文生成",
         desc="媒体と案件種別に合わせて、アフィリエイト開示・PR表記の文案を生成するブラウザツールです。",
         features=["媒体別の文案テンプレ", "ワンクリックコピー", "サーバー送信なし", "即デプロイ可能な静的HTML"]),
    dict(rank=4, id="B2", slug="resale-profit-mini", title="せどり利益計算ミニアプリ",
         price="¥480", form="B", category="resale", kind="tool", emoji="🧮",
         badge="Webアプリ 買い切り", sublabel="手数料プリセット付き",
         desc="仕入・販売・送料・各モール手数料から見込み利益をすぐ計算するスマホ向けミニアプリです。",
         features=["メルカリ/Amazon等の手数料プリセット", "利益率の即表示", "端末内保存", "せどらーSへの入口にも"]),
    dict(rank=5, id="B6", slug="resale-tax-notebook", title="せどり確定申告メモ帳",
         price="¥780", form="B", category="resale", kind="template", emoji="🧾",
         badge="スプレッドシート 買い切り", sublabel="仕入・売上・経費の年次メモ",
         desc="せどりの仕入・売上・経費を年次で残し、確定申告前の整理をラクにするスプレッドシートテンプレートです。",
         features=["月次入力→年次集計", "経費カテゴリ付き", "年末アップデート想定", "CSV雛形同梱"]),
    dict(rank=6, id="C2", slug="missed-last-train-checklist", title="終電逃した夜チェックリスト",
         price="¥280", form="B", category="hotel", kind="guide", emoji="🌙",
         badge="チェックリスト 買い切り", sublabel="今夜どうするかを1枚で",
         desc="終電を逃した夜に、ホテル・代替施設・帰宅手段を落ち着いて選ぶためのチェックリストです。",
         features=["判断の順番を固定", "終電ホテルサイトと併用", "超低単価の入口商材", "Markdown/PDF想定"]),
    dict(rank=7, id="D4", slug="llms-txt-ai-citation-kit", title="llms.txt / AI引用対策キット",
         price="¥980", form="B", category="seo-ops", kind="template", emoji="🤖",
         badge="テンプレート 買い切り", sublabel="AI検索・引用向けサイト整備",
         desc="llms.txt、要約用メタ、引用されやすいFAQ構造の雛形と設置手順をまとめた個人開発者向けキットです。",
         features=["llms.txt雛形", "FAQ構造化の例", "設置チェックリスト", "公開キットのアップセル"]),
    dict(rank=8, id="E2", slug="quiz-pack-takken-sharoushi", title="資格問題パック（宅建・社労士）",
         price="¥980", form="B", category="life-learn", kind="content", emoji="📚",
         badge="問題パック 買い切り", sublabel="AI Quiz / StudyLaw 横展開",
         desc="宅建・社労士向けの一問一答・四択問題データパック。既存クイズアプリに流し込んで使えます。",
         features=["JSON問題データ", "カテゴリ分け済み", "解説フィールド付き", "差し替え手順README"]),
    dict(rank=9, id="I3", slug="oshi-trip-planner", title="推し活遠征 終電・ホテル同梱プランナー",
         price="¥780", form="B", category="hobby", kind="tool", emoji="✨",
         badge="Webアプリ 買い切り", sublabel="遠征×終電×宿の一体計画",
         desc="イベント終了時刻・終電・ホテル条件を一画面で整理する、推し活遠征向けプランナーです。",
         features=["終了時刻から逆算", "宿条件メモ", "チェックリスト出力", "終電ホテル導線と接続"]),
    dict(rank=10, id="C1", slug="shuden-hotel-pro", title="終電ホテル Pro（月額アラート）",
         price="¥480/月", form="M", category="hotel", kind="monthly", emoji="🏨",
         badge="月額アラート", sublabel="終電前リマインド＆今夜の宿サマリー",
         desc="路線・駅のウォッチと終電前アラート、今夜のホテル候補サマリーを提供する個人向け月額プランです。",
         features=["ウォッチ最大5件", "終電前通知", "今夜候補サマリー", "いつでも解約可（想定）"]),
    # —— 残り（★多め優先、カテゴリ横断） ——
    dict(rank=11, id="A1", slug="rakuten-room-30day-calendar", title="楽天ROOM 30日投稿カレンダー",
         price="¥980", form="B", category="affiliate", kind="template", emoji="📅",
         badge="テンプレート 買い切り", sublabel="投稿テーマ＋文例30日分",
         desc="楽天ROOMを30日止めずに回すための投稿テーマ・文例カレンダーです。",
         features=["30日分のテーマ", "文例つき", "セール週の差し替え欄", "ROOM改善ツールと併用可"]),
    dict(rank=12, id="E5", slug="subscription-cancel-alert", title="サブスク解約忘れアラート",
         price="¥300/月", form="M", category="life-learn", kind="monthly", emoji="🔔",
         badge="月額", sublabel="更新日前に通知",
         desc="サブスクの更新日を登録し、解約忘れを防ぐ個人向けリマインダーです。",
         features=["更新日リマインド", "金額メモ", "カテゴリ分け", "家計ツールと併売向き"]),
    dict(rank=13, id="D2", slug="ga4-event-cheatsheet", title="GA4イベント設計チートシート",
         price="¥780", form="B", category="seo-ops", kind="guide", emoji="📈",
         badge="チートシート 買い切り", sublabel="ブログ/比較/予約の計測設計",
         desc="ブログ・比較・予約サイト向けに、入れるべきGA4イベントと命名規則をまとめたチートシートです。",
         features=["用途別イベント一覧", "命名規則", "実装チェック", "個人開発サイト向け"]),
    dict(rank=14, id="D7", slug="84repo-ops-playbook", title="84リポ運用 公開プレイブック",
         price="¥1,980", form="P", category="seo-ops", kind="guide", emoji="📦",
         badge="プレイブック", sublabel="多リポ個人開発の回し方",
         desc="多数リポジトリを抱えながら公開・計測・棚卸しする運用の型をまとめたプレイブックです。",
         features=["公開チェックの型", "棚卸し周期", "計測の最低ライン", "RepoKuraとの併用"]),
    dict(rank=15, id="G2", slug="release-notes-announcer", title="リリースノート→告知文3種変換",
         price="¥480", form="B", category="content", kind="tool", emoji="📣",
         badge="Webツール 買い切り", sublabel="X / ブログ / BOOTH用",
         desc="リリースノートを貼ると、X・ブログ・BOOTH向けの告知文3種を生成するツールです。",
         features=["3媒体一括生成", "コピーボタン", "静的HTML", "個人開発のリリース儀式を短縮"]),
    dict(rank=16, id="H1", slug="hotel-listing-b2b", title="ホテル・簡易宿所の終電サイト掲載",
         price="¥5,000〜/月", form="S", category="b2b", kind="b2b", emoji="🛎️",
         badge="B2B 掲載", sublabel="終電ホテルへの店舗掲載",
         desc="終電・ホテル比較サイトへの宿泊施設掲載枠。計測付きの店舗ページを提供するB2Bメニューです。",
         features=["店舗ページ", "問い合わせ導線", "掲載計測", "個人Proからの需要証明向き"]),
    dict(rank=17, id="A2", slug="asp-listing-rules-checker", title="アフィ案件 掲載条件チェッカー",
         price="¥580", form="B", category="affiliate", kind="template", emoji="✅",
         badge="スプレッドシート 買い切り", sublabel="規約・表記の漏れ防止",
         desc="ASP・案件ごとの掲載条件や表記ルールをチェックするスプレッドシートです。",
         features=["案件別チェック欄", "表記必須項目", "差し止め予防", "週次運用向け"]),
    dict(rank=18, id="A3", slug="amazon-associate-review-kit", title="Amazonアソシエイト 週次レビュー投稿キット",
         price="¥980", form="B", category="affiliate", kind="template", emoji="📦",
         badge="キット 買い切り", sublabel="レビュー文・構成テンプレ",
         desc="Amazonアソシエイト向けに、週次で回せるレビュー構成と文例テンプレートを同梱したキットです。",
         features=["構成テンプレ", "文例", "週次カレンダー", "楽天偏重の補完"]),
    dict(rank=19, id="A4", slug="blog-revenue-simulator", title="ブログ収益シミュレーション",
         price="¥1,480", form="B", category="affiliate", kind="tool", emoji="💹",
         badge="Webアプリ 買い切り", sublabel="CTR→報酬の試算",
         desc="PV・CTR・承認率・単価から記事・サイトの見込み報酬を試算するシミュレータです。",
         features=["ASP別パラメータ", "記事単位試算", "感度分析", "ブラウザ完結"]),
    dict(rank=20, id="A8", slug="room-erabiyori-playbook", title="楽天ROOM×えらびより 連携プレイブック",
         price="¥1,480", form="P", category="affiliate", kind="guide", emoji="🔗",
         badge="プレイブック", sublabel="自社ツール横断の使い方",
         desc="えらびよりで候補を探し、ROOM改善ツールで投稿・診断する一連の流れをまとめたプレイブックです。",
         features=["連携フロー図", "週次ルーチン", "事例メモ欄", "クロスセル用"]),
    dict(rank=21, id="A9", slug="affiliate-first-10k-guide", title="副業アフィ 月1万円までの手順書",
         price="¥2,480", form="P", category="affiliate", kind="content", emoji="🎬",
         badge="手順書・動画構成", sublabel="やり方から入る層向け",
         desc="副業アフィリエイトで月1万円を目指す手順を、動画台本付きでまとめたコンテンツ商品です。",
         features=["ステップ手順", "動画台本", "チェックリスト", "ツール導線付き"]),
    dict(rank=22, id="B1", slug="resale-store-route-map", title="店舗別 今日の仕入れルートマップ",
         price="¥580", form="B", category="resale", kind="template", emoji="🗺️",
         badge="テンプレート 買い切り", sublabel="店舗せどりの移動最適化",
         desc="今日回る買取・仕入れ店舗の順序とメモを残すルートマップテンプレートです。",
         features=["店舗リスト", "ルート順", "仕入メモ", "日次利用"]),
    dict(rank=23, id="B3", slug="inventory-deadline-reminder", title="保管・出品期限リマインダー",
         price="¥380/月", form="M", category="resale", kind="monthly", emoji="⏰",
         badge="月額", sublabel="置きっぱなし在庫を減らす",
         desc="保管期限・出品期限を登録し、通知で回転を促すせどり向け月額リマインダーです。",
         features=["期限登録", "通知想定", "SKUメモ", "在庫回転改善"]),
    dict(rank=24, id="B4", slug="media-resale-condition-guide", title="メディアせどり コンディション判定ガイド",
         price="¥980", form="P", category="resale", kind="guide", emoji="📀",
         badge="ガイド", sublabel="DVD/CDの状態判定",
         desc="DVD/CDのせどりで迷いがちなコンディション判定基準を写真例つきでまとめたガイドです。",
         features=["判定基準表", "写真チェック観点", "JANツールと併用", "初心者向け"]),
    dict(rank=25, id="B7", slug="jan-mercari-draft", title="JAN一括→メルカリ下書き文生成",
         price="¥1,480", form="B", category="resale", kind="tool", emoji="🏷️",
         badge="Webアプリ 買い切り", sublabel="出品文の量産",
         desc="JANや商品名の一覧からメルカリ向け下書き文を一括生成するツールです。",
         features=["CSV/手入力対応", "文面テンプレ", "コピー出力", "出品ボトルネック解消"]),
    dict(rank=26, id="B10", slug="keepa-cheatsheet", title="Keepa見方チートシート",
         price="¥380", form="B", category="resale", kind="guide", emoji="📉",
         badge="チートシート 買い切り", sublabel="グラフの読み方入門",
         desc="Keepaグラフの基本的な見方と仕入れ判断の観点を1枚にまとめたチートシートです。",
         features=["指標の意味", "仕入れ判断の目安", "初心者向け", "低単価入口"]),
    dict(rank=27, id="C3", slug="line-lasttrain-hotel-notes", title="路線別・終電後ホテル攻略ノート",
         price="¥500", form="P", category="hotel", kind="content", emoji="🚇",
         badge="攻略ノート", sublabel="路線×終電後の宿",
         desc="主要路線ごとに終電後のホテル・代替の考え方をまとめた攻略ノートです。",
         features=["路線別メモ", "駅チカ観点", "サイト内部リンク向き", "PPV/ノート想定"]),
    dict(rank=28, id="C4", slug="business-trip-pack", title="出張パック（終電＋ビジネスホテル）",
         price="¥680/月", form="M", category="hotel", kind="monthly", emoji="💼",
         badge="月額", sublabel="出張者向け条件保存",
         desc="出張時の終電条件とビジネスホテルの希望条件を保存し、毎回の探し直しを減らす月額パックです。",
         features=["条件保存", "終電ウォッチ", "予算帯メモ", "個人事業主向け"]),
    dict(rank=29, id="C8", slug="night-alternative-map", title="カプセル・サウナ・漫画喫茶の代替マップ",
         price="¥480", form="B", category="hotel", kind="tool", emoji="🗺️",
         badge="Webアプリ 買い切り", sublabel="ホテル満室時の代替",
         desc="終電後にホテルが取れないときのための、カプセル・サウナ・漫画喫茶などの代替候補マップです。",
         features=["代替カテゴリ", "メモ登録", "エリア絞り込みUI", "終電導線の補完"]),
    dict(rank=30, id="C10", slug="event-end-alert", title="イベント終了時刻連動アラート",
         price="¥480/月", form="M", category="hotel", kind="monthly", emoji="🎳",
         badge="月額", sublabel="ライブ・ボウリング向け",
         desc="イベント終了時刻から終電・移動を逆算して通知するアラート（ライブ・プロチャレンジ等）。",
         features=["終了時刻登録", "終電逆算", "趣味導線接続", "月額通知"]),
    dict(rank=31, id="D1", slug="indexnow-weekly-health", title="IndexNow＋sitemap 週次健康診断",
         price="¥480/月", form="M", category="seo-ops", kind="monthly", emoji="🩺",
         badge="月額", sublabel="公開キットの継続版",
         desc="sitemapとIndexNowの状態を週次で健康診断する個人開発者向け月額レポートです。",
         features=["週次レポート想定", "sitemap確認観点", "IndexNow観点", "公開キット連携"]),
    dict(rank=32, id="D3", slug="gsc-drop-weekly-mail", title="Search Console 急落週次メール",
         price="¥680/月", form="M", category="seo-ops", kind="monthly", emoji="📉",
         badge="月額", sublabel="見ていないと気づかない下落",
         desc="Search Consoleのクリック/表示の急落を週次メールで知らせる監視サービス案です。",
         features=["急落検知の考え方案", "週次メール", "複数プロパティ", "SEOダッシュボード連携"]),
    dict(rank=33, id="D6", slug="vercel-bill-shock-checker", title="Vercel請求ショック防止チェッカー",
         price="¥480", form="B", category="seo-ops", kind="tool", emoji="💸",
         badge="Webツール 買い切り", sublabel="帯域・関数の目安チェック",
         desc="PVや関数実行の見積から、Vercel請求が跳ねそうなポイントをチェックするツールです。",
         features=["ざっくり見積", "注意閾値", "静的HTML", "多サイト運営者向け"]),
    dict(rank=34, id="D8", slug="comparison-site-starter", title="比較サイト量産スターター（Next）",
         price="¥2,980", form="B", category="seo-ops", kind="template", emoji="🧩",
         badge="Nextテンプレ 買い切り", sublabel="比較・ランキングサイトの型",
         desc="比較・ランキング系サイトを量産するためのNext.jsスターターテンプレートです。",
         features=["一覧/詳細の型", "メタ設定例", "アフィカード部品", "CROSS-ASP系の製品化"]),
    dict(rank=35, id="D10", slug="ogp-favicon-kit", title="OGP・ファビコン一括生成キット",
         price="¥380", form="B", category="seo-ops", kind="tool", emoji="🖼️",
         badge="キット 買い切り", sublabel="毎回やる単純作業を短縮",
         desc="サイト名・色からOGP文言とファビコン用SVGの出発点を生成するキットです。",
         features=["OGP文言生成", "SVGファビコン雛形", "サイズチェックリスト", "公開前の時短"]),
    dict(rank=36, id="D11", slug="structured-data-snippets", title="構造化データ スニペット集",
         price="¥780", form="B", category="seo-ops", kind="template", emoji="🧱",
         badge="スニペット 買い切り", sublabel="FAQ/Product/LocalBusiness",
         desc="FAQ・Product・LocalBusinessなど、よく使うJSON-LDスニペットを用途別にまとめた集です。",
         features=["用途別JSON-LD", "貼り付け例", "検証チェック", "SEO実務向け"]),
    dict(rank=37, id="E1", slug="exam-pace-maker", title="資格試験カウントダウン＋ペースメーカー",
         price="¥480/月", form="M", category="life-learn", kind="monthly", emoji="🎯",
         badge="月額", sublabel="過去問ペース管理",
         desc="試験日から逆算した過去問ペースを管理する資格学習向け月額ツールです。",
         features=["試験日カウントダウン", "週間ペース", "復習フラグ", "クイズアプリ連携想定"]),
    dict(rank=38, id="E3", slug="sando-bozu-comeback-kit", title="三日坊主 復帰キット",
         price="¥480", form="B", category="life-learn", kind="guide", emoji="🔁",
         badge="キット 買い切り", sublabel="GoalPilot連携の復帰手順",
         desc="挫折したあとに戻る手順を短くまとめた復帰キット。GoalPilot利用者向けの補助教材です。",
         features=["1分カムバック手順", "ご褒美設計メモ", "チェックリスト", "感情的購買に強い"]),
    dict(rank=39, id="E6", slug="medical-furusato-notebook", title="医療費控除・ふるさと納税メモ帳",
         price="¥580", form="B", category="life-learn", kind="template", emoji="🏥",
         badge="スプレッドシート 買い切り", sublabel="年一の書類整理",
         desc="医療費控除とふるさと納税の記録を年次で残すメモ帳テンプレートです。",
         features=["領収メモ", "寄付先一覧", "年次集計", "確定申告前の整理"]),
    dict(rank=40, id="E8", slug="leave-home-checklist", title="出门前チェック（忘れもの防止）",
         price="¥480", form="B", category="life-learn", kind="tool", emoji="🚪",
         badge="Webアプリ 買い切り", sublabel="出门前の確認リスト",
         desc="鍵・財布・定期など、出门前に確認する項目をカスタムできるチェックアプリです。",
         features=["カスタム項目", "ワンタップ完了", "端末内保存", "習慣系の定番ペルソナ"]),
    dict(rank=41, id="F1", slug="rent-market-watch", title="賃料相場ウォッチ（市区町村）",
         price="¥680/月", form="M", category="realestate", kind="monthly", emoji="🏘️",
         badge="月額", sublabel="転居シーズン向け",
         desc="市区町村単位の賃料相場をウォッチし、変動を追う個人向け月額サービス案です。",
         features=["エリア登録", "月次比較の型", "転居検討向け", "価格ウォッチの居住版"]),
    dict(rank=42, id="F2", slug="rent-vs-buy-simulator", title="家賃vs購入 簡易シミュレータ",
         price="¥980", form="B", category="realestate", kind="tool", emoji="🏠",
         badge="Webアプリ 買い切り", sublabel="ざっくり比較",
         desc="家賃・購入・金利・修繕などの前提を入れ、家賃継続と購入を比較する簡易シミュレータです。",
         features=["前提パラメータ", "総額比較", "注意書き（助言ではない）", "ブラウザ完結"]),
    dict(rank=43, id="F6", slug="relocation-cost-sheet", title="地方移住コスト試算シート",
         price="¥580", form="B", category="realestate", kind="template", emoji="🌲",
         badge="スプレッドシート 買い切り", sublabel="移住前の費用見える化",
         desc="引っ越し・家賃差・交通・生活費など、地方移住のコストを試算するシートです。",
         features=["費用カテゴリ", "月次/初期の分け", "比較メモ", "話題性のあるニッチ"]),
    dict(rank=44, id="G1", slug="x-thread-composer", title="Xスレッド構成ジェネレータ",
         price="¥580", form="B", category="content", kind="tool", emoji="🧵",
         badge="Webツール 買い切り", sublabel="告知・解説スレの型",
         desc="テーマを入れるとX（Twitter）スレッドの構成案を生成するツールです。",
         features=["投稿分割案", "フック文案", "コピー", "個人開発の集客向け"]),
    dict(rank=45, id="G3", slug="booth-thumb-presets", title="BOOTHサムネ文言・配色プリセット",
         price="¥380", form="B", category="content", kind="template", emoji="🎨",
         badge="プリセット 買い切り", sublabel="出品画像の出発点",
         desc="BOOTH出品用のサムネ文言パターンと配色プリセットをまとめたキットです。",
         features=["文言パターン", "配色例", "サイズ目安", "自社出品にも利用可"]),
    dict(rank=46, id="G5", slug="tsumiage-devlog-template", title="積み上げログ式 開発日記テンプレ",
         price="¥280", form="B", category="content", kind="template", emoji="📝",
         badge="テンプレート 買い切り", sublabel="ブランドの型を売る",
         desc="積み上げログで使っている開発日記の書き方テンプレートです。",
         features=["見出し構成", "振り返り欄", "公開チェック", "ブランド一貫"]),
    dict(rank=47, id="H2", slug="buyback-shop-spotlight-b2b", title="買取店「本日の買取強化」枠",
         price="¥10,000/月", form="S", category="b2b", kind="b2b", emoji="💰",
         badge="B2B 掲載", sublabel="買取強化の日次枠",
         desc="買取価格比較・仕入れ系サイト上で、店舗の「本日の買取強化」を出すB2B掲載枠です。",
         features=["日次枠", "JAN/カテゴリ指定", "問い合わせ導線", "Buyback系の裏表"]),
    dict(rank=48, id="H3", slug="bowling-venue-listing-pro", title="ボウリング場イベント掲載Pro",
         price="¥3,000〜/月", form="S", category="b2b", kind="b2b", emoji="🎳",
         badge="B2B 掲載", sublabel="bowling-event.jp 向け",
         desc="ボウリング場のプロチャレンジ等イベントを優先掲載する会場向けProプランです。",
         features=["イベント掲載", "会場ページ", "更新導線", "趣味サイト monetize"]),
    dict(rank=49, id="H7", slug="site-health-audit-service", title="サイト健康診断（単発）",
         price="¥9,800/件", form="S", category="b2b", kind="b2b", emoji="🔍",
         badge="単発サービス", sublabel="個人開発者向け監査",
         desc="SEO・計測・公開設定を単発で診断するサービスメニュー（公開キットの上位）。",
         features=["診断項目リスト", "報告書テンプレ", "改善優先度", "キットへの導線"]),
    dict(rank=50, id="I1", slug="pro-challenge-checklist", title="プロチャレンジ参戦チェックリスト",
         price="¥380", form="B", category="hobby", kind="guide", emoji="🏆",
         badge="チェックリスト 買い切り", sublabel="当日までの準備",
         desc="ボウリングのプロチャレンジ参戦に向けた持ち物・予約・当日の流れのチェックリストです。",
         features=["事前準備", "当日動線", "実体験ベース", "趣味信頼"]),
    dict(rank=51, id="A6", slug="affiliate-rewrite-brief", title="アフィ記事リライト指示書ジェネレータ",
         price="¥980", form="B", category="affiliate", kind="tool", emoji="✍️",
         badge="Webツール 買い切り", sublabel="SEO停滞記事の立て直し",
         desc="テーマと現状課題を入れると、アフィ記事のリライト指示書を生成するツールです。",
         features=["指示書自動生成", "検索意図欄", "CTA設計", "content-brief姉妹"]),
    dict(rank=52, id="A7", slug="asp-denial-casebook", title="ASP別 否認パターン事例集",
         price="¥1,980", form="P", category="affiliate", kind="guide", emoji="📕",
         badge="事例集", sublabel="不安を減らす教材",
         desc="アフィリエイト成果否認で起きやすいパターンをASP横断で整理した事例集です。",
         features=["パターン分類", "予防チェック", "年1更新想定", "不安商材"]),
    dict(rank=53, id="B5", slug="buyback-ocr-table", title="買取店価格スクショ→表変換",
         price="¥980", form="B", category="resale", kind="tool", emoji="🖼️",
         badge="Webツール 買い切り", sublabel="手集計の苦痛を減らす",
         desc="買取価格表のスクショやテキストから、比較用テーブルへ落とし込む支援ツールです。",
         features=["テキスト整形", "表プレビュー", "CSV出力", "手作業削減"]),
    dict(rank=54, id="B8", slug="loss-sku-flag-sheet", title="赤字SKU 自動フラグシート",
         price="¥580", form="B", category="resale", kind="template", emoji="🚩",
         badge="スプレッドシート 買い切り", sublabel="在庫回転の可視化",
         desc="仕入と売価から赤字・滞留SKUにフラグを立てる在庫管理シートです。",
         features=["利益フラグ", "滞留日数", "処分候補リスト", "回転改善"]),
    dict(rank=55, id="B9", slug="store-photo-organizer", title="店舗せどり写真フォルダ整理",
         price="¥480", form="B", category="resale", kind="template", emoji="📷",
         badge="ルール＋スクリプト", sublabel="撮影枚数が多い人向け",
         desc="店舗せどりで撮った写真を日付・店舗・JANで整理するためのフォルダルールと補助スクリプトです。",
         features=["命名規則", "フォルダ雛形", "整理スクリプト例", "出品前の時短"]),
    dict(rank=56, id="C5", slug="nomikai-season-alert", title="飲み会シーズン終電アラート",
         price="¥300/月", form="M", category="hotel", kind="monthly", emoji="🍻",
         badge="期間限定月額", sublabel="忘年会・歓送迎会",
         desc="飲み会シーズン向けに、終電前リマインドを強調した期間限定月額アラートです。",
         features=["季節訴求", "終電前通知", "低価格", "終電ホテル導線"]),
    dict(rank=57, id="C6", slug="station-hotel-walk-report", title="駅チカホテル 徒歩分検証レポート",
         price="¥480", form="P", category="hotel", kind="content", emoji="🚶",
         badge="PPVレポート", sublabel="実歩測の信頼コンテンツ",
         desc="駅からの実徒歩分を検証したホテルレポート（PPV想定）のテンプレート＆サンプルです。",
         features=["検証フォーマット", "サンプル1本", "UGC的信頼", "路線ノート連動"]),
    dict(rank=58, id="C7", slug="hotel-listing-cms", title="ホテル掲載枠CMS（店舗ページ＋計測）",
         price="¥5,000〜/月", form="S", category="b2b", kind="b2b", emoji="🗂️",
         badge="B2B CMS", sublabel="掲載運用の裏側",
         desc="ホテル掲載枠を運用するための店舗ページCMSと簡易計測のスターターです。",
         features=["店舗CRUDの型", "計測イベント案", "公開ページ雛形", "H1の実装基盤"]),
    dict(rank=59, id="C9", slug="lasttrain-taxi-compare", title="終電＋タクシー概算 帰るvs泊まる",
         price="¥980", form="B", category="hotel", kind="tool", emoji="🚕",
         badge="Webアプリ 買い切り", sublabel="意思決定の比較",
         desc="終電帰宅（タクシー含む）とホテル宿泊の概算コストを比べる比較ツールです。",
         features=["概算入力", "比較表示", "注意書き", "終電サイト導線"]),
    dict(rank=60, id="D5", slug="domain-expiry-calendar", title="ドメイン棚卸し＋更新期限カレンダー",
         price="¥580", form="B", category="seo-ops", kind="template", emoji="🌐",
         badge="テンプレート 買い切り", sublabel="多サイト運営者向け",
         desc="保有ドメインの更新期限・DNS・用途を一覧化する棚卸しカレンダーです。",
         features=["更新期限", "用途メモ", "移管メモ", "多サイト向け"]),
    dict(rank=61, id="D9", slug="safe-niche-list", title="安全ニッチリスト（アダルト除外済み）",
         price="¥480", form="B", category="seo-ops", kind="guide", emoji="🧭",
         badge="リスト 買い切り", sublabel="サイト選定の時短",
         desc="個人開発・アフィで扱いやすい安全寄りのニッチ候補を整理したリストです（アダルト除外）。",
         features=["ニッチ候補", "切り口例", "注意ジャンル", "選定時短"]),
    dict(rank=62, id="D12", slug="launch-90day-kpi", title="個人開発 公開90日KPIシート",
         price="¥480", form="B", category="seo-ops", kind="template", emoji="📊",
         badge="スプレッドシート 買い切り", sublabel="公開後の数字管理",
         desc="サイト公開後90日のPV・登録・収益KPIを追うシートです。",
         features=["週次KPI", "仮説メモ", "振り返り欄", "GoalPilot的な開発者版"]),
    dict(rank=63, id="E4", slug="fridge-loss-sheet", title="食材ロス削減・冷蔵庫在庫シート",
         price="¥380", form="B", category="life-learn", kind="template", emoji="🥬",
         badge="スプレッドシート 買い切り", sublabel="時短レシピの隣接",
         desc="冷蔵庫の在庫と消費期限を書き、ロスを減らすための在庫シートです。",
         features=["在庫一覧", "期限", "使い切りメモ", "レシピツール併売"]),
    dict(rank=64, id="E7", slug="commute-quiz-timer", title="通勤スキマ学習タイマー＋クイズ",
         price="¥680", form="B", category="life-learn", kind="tool", emoji="🚆",
         badge="Webアプリ 買い切り", sublabel="通勤時間の一問一答",
         desc="通勤時間に合わせた学習タイマーと、短問クイズを回すアプリです。",
         features=["分数タイマー", "短問UI", "連続記録", "資格アプリ導線"]),
    dict(rank=65, id="E9", slug="sleep-debt-calendar", title="睡眠負債カレンダー",
         price="¥380", form="B", category="life-learn", kind="tool", emoji="😴",
         badge="Webアプリ 買い切り", sublabel="単純記録",
         desc="睡眠時間を記録し、ざっくりとした睡眠負債を可視化するカレンダーアプリです。",
         features=["日次記録", "週次合計", "端末内保存", "低開発コスト商品"]),
    dict(rank=66, id="E10", slug="oshi-catcafe-spend-log", title="猫カフェ・推し活支出ログ",
         price="¥480", form="B", category="hobby", kind="template", emoji="🐱",
         badge="スプレッドシート 買い切り", sublabel="趣味家計",
         desc="推し活・猫カフェなど趣味支出を記録する家計ログテンプレートです。",
         features=["カテゴリ別支出", "月次集計", "イベントメモ", "PPV趣味と一貫"]),
    dict(rank=67, id="F3", slug="condo-fee-guide", title="管理費・修繕積立の見え方ガイド",
         price="¥780", form="P", category="realestate", kind="guide", emoji="🏢",
         badge="ガイド", sublabel="購入検討者の不安対策",
         desc="マンション購入時に見るべき管理費・修繕積立の観点をまとめたガイドです。",
         features=["見るべき項目", "注意サイン", "質問リスト", "投資助言ではない旨"]),
    dict(rank=68, id="F4", slug="akiya-transfer-checklist", title="空き家・譲渡の基礎チェックリスト",
         price="¥480", form="B", category="realestate", kind="guide", emoji="🏚️",
         badge="チェックリスト 買い切り", sublabel="手続きの全体像",
         desc="空き家の譲渡・整理で確認したい基礎項目のチェックリストです。",
         features=["関係者確認", "書類メモ", "次アクション", "行政データ系と相性"]),
    dict(rank=69, id="F5", slug="local-shop-finder-template", title="地元店舗の探し方テンプレ",
         price="¥580", form="B", category="realestate", kind="template", emoji="🏪",
         badge="テンプレート 買い切り", sublabel="まちリスト系の型",
         desc="地域の店舗・スポットを調べてまとめるための探し方・掲載テンプレートです。",
         features=["調査手順", "掲載項目", "カテゴリ例", "machi-list資産の製品化"]),
    dict(rank=70, id="G4", slug="blog-to-short-script", title="ブログ→ショート動画台本変換",
         price="¥980", form="B", category="content", kind="tool", emoji="🎥",
         badge="Webツール 買い切り", sublabel="ストック記事の再利用",
         desc="ブログ記事を貼ると、ショート動画向けの台本構成に変換するツールです。",
         features=["章立て変換", "尺目安", "フック案", "再利用"]),
    dict(rank=71, id="H4", slug="jan-inventory-widget-b2b", title="店舗向けJAN在庫公開ウィジェット",
         price="¥4,800/月", form="S", category="b2b", kind="b2b", emoji="📡",
         badge="B2B", sublabel="dvd-jan の法人版",
         desc="店舗のJAN在庫をサイトに埋め込める公開ウィジェットのB2Bメニュー／スターターです。",
         features=["埋め込みsnippet案", "在庫APIの型", "店舗向け", "DVD JAN連動"]),
    dict(rank=72, id="H5", slug="local-seo-monthly-report", title="地域店舗 SEO月刊レポート代行",
         price="¥15,000/月", form="S", category="b2b", kind="b2b", emoji="📑",
         badge="B2B 代行", sublabel="高単価・手厚い",
         desc="地域店舗向けにSEO状況を月刊レポートする代行サービスメニューです。",
         features=["レポート雛形", "改善提案欄", "打ち合わせアジェンダ", "高単価"]),
    dict(rank=73, id="H6", slug="sauna-manga-night-ad", title="サウナ・漫画喫茶の終電後枠広告",
         price="¥8,000/月", form="S", category="b2b", kind="b2b", emoji="♨️",
         badge="B2B 広告枠", sublabel="終電後の代替施設",
         desc="終電後の代替マップ上に出す、サウナ・漫画喫茶向け広告枠メニューです。",
         features=["枠メニュー", "掲載仕様", "代替マップ連動", "夜間需要"]),
    dict(rank=74, id="H8", slug="resale-school-whitelabel", title="せどりスクール向けツール白ラベル",
         price="要見積", form="S", category="b2b", kind="b2b", emoji="🏫",
         badge="B2B 白ラベル", sublabel="sedora 系の法人提供",
         desc="せどりスクール・コミュニティ向けに査定ツールを白ラベル提供するための提案・構成キットです。",
         features=["提供範囲の型", "料金テーブル案", "オンボーディング", "sedora連動"]),
    dict(rank=75, id="I2", slug="retro-cafe-map-kit", title="レトロ喫茶マップ作り方キット",
         price="¥480", form="B", category="hobby", kind="guide", emoji="☕",
         badge="キット 買い切り", sublabel="PPV連動の趣味コンテンツ",
         desc="レトロ喫茶を調べてマップ化する手順とテンプレートのキットです。",
         features=["調査手順", "マップ項目", "写真の撮り方", "趣味PPV連動"]),
    dict(rank=76, id="I4", slug="cat-goods-room-examples", title="猫用品アフィ ROOM文例50",
         price="¥480", form="B", category="hobby", kind="content", emoji="😺",
         badge="文例集 買い切り", sublabel="楽天ROOM×趣味",
         desc="猫用品アフィリエイト向けの楽天ROOM投稿文例50本です。",
         features=["文例50", "カテゴリ分け", "開示文セット", "ROOMツール併売"]),
    dict(rank=77, id="I5", slug="chita-local-spots-db", title="知多半島 地元スポットDB雛形",
         price="¥580", form="B", category="hobby", kind="template", emoji="🌏",
         badge="DB雛形 買い切り", sublabel="知多丸ブランドの原点",
         desc="知多半島の地元スポットを蓄積するためのデータ雛形と収集ルールです。",
         features=["スポットスキーマ", "カテゴリ例", "収集ルール", "地域ブランド"]),
    dict(rank=78, id="I6", slug="dev-focus-bgm-timer", title="作業BGMプレイリスト＋集中タイマー",
         price="¥280", form="B", category="hobby", kind="tool", emoji="🎧",
         badge="Webアプリ 買い切り", sublabel="開発配信・作業用",
         desc="作業用の集中タイマーとBGMプレイリストメモを組み合わせた小さなツールです。",
         features=["ポモドーロ風タイマー", "プレイリストメモ", "静的HTML", "ノベルティ向き"]),
]

CATEGORY_LABELS = {
    "affiliate": "アフィリエイト・収益化",
    "seo-ops": "SEO・サイト運用",
    "resale": "せどり・買取・在庫",
    "life-learn": "生活・学習・習慣化",
    "content": "コンテンツ制作",
    "realestate": "不動産・投資",
    "hotel": "終電・ホテル・移動",
    "hobby": "趣味・推し活・地域",
    "b2b": "B2B・店舗・業務",
}

GRADIENTS = {
    "affiliate": "linear-gradient(135deg, #a02b36 0%, #6b0f1a 100%)",
    "seo-ops": "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
    "resale": "linear-gradient(135deg, #b45309 0%, #78350f 100%)",
    "life-learn": "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    "content": "linear-gradient(135deg, #db2777 0%, #9d174d 100%)",
    "realestate": "linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)",
    "hotel": "linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)",
    "hobby": "linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)",
    "b2b": "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
}


def repo_name(slug: str) -> str:
    return f"chitamaru-{slug}"


def write_common(repo: Path, p: dict) -> None:
    repo.mkdir(parents=True, exist_ok=True)
    (repo / "LICENSE").write_text("UNLICENSED — All rights reserved (Chitamaru / syunnjack)\n", encoding="utf-8")
    (repo / ".gitignore").write_text("node_modules/\n.env\n.DS_Store\ndist/\n", encoding="utf-8")
    booth = f"https://chitamaru.booth.pm/items/{p['slug']}"
    features = "\n".join(f"- {f}" for f in p["features"])
    readme = f"""# {p['title']}

知多丸（Chitamaru）商品 — おすすめ順 **#{p['rank']}**（ID: {p['id']}）

- 価格目安: **{p['price']}**（形態: {p['form']}）
- BOOTH（予定）: {booth}
- ストア: https://syunnjack.dev/store
- カテゴリ: {CATEGORY_LABELS.get(p['category'], p['category'])}

## 概要

{p['desc']}

## できること

{features}

## 使い方

1. このリポジトリをクローン（または BOOTH で購入した ZIP を解凍）
2. `README` と `docs/` / `app/` を確認
3. テンプレートはそのままコピー、ツールは `app/index.html` を開くか静的ホストへデプロイ

## 開発

```bash
# 静的ツールの場合
open app/index.html
# or
npx --yes serve app
```

## ブランド

知多丸 / 積み上げログ — https://syunnjack.dev
"""
    (repo / "README.md").write_text(readme, encoding="utf-8")
    meta = {
        "slug": p["slug"],
        "repo": repo_name(p["slug"]),
        "recommendRank": p["rank"],
        "ideaId": p["id"],
        "title": p["title"],
        "price": p["price"],
        "form": p["form"],
        "category": p["category"],
        "kind": p["kind"],
        "boothUrl": booth,
    }
    (repo / "chitamaru.product.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_tool(repo: Path, p: dict) -> None:
    app = repo / "app"
    app.mkdir(exist_ok=True)
    title = p["title"]
    (app / "index.html").write_text(
        f"""<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} | 知多丸</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <main class="wrap">
    <p class="brand">知多丸</p>
    <h1>{title}</h1>
    <p class="lead">{p['desc']}</p>
    <section class="panel">
      <label for="input">入力</label>
      <textarea id="input" rows="6" placeholder="ここに内容を入力…"></textarea>
      <div class="row">
        <button type="button" id="run">生成する</button>
        <button type="button" id="copy" class="ghost">コピー</button>
      </div>
      <label for="output">出力</label>
      <textarea id="output" rows="8" readonly></textarea>
    </section>
    <p class="foot">買い切り想定 {p['price']} — <a href="https://chitamaru.booth.pm/items/{p['slug']}">BOOTH</a></p>
  </main>
  <script src="./app.js"></script>
</body>
</html>
""",
        encoding="utf-8",
    )
    (app / "styles.css").write_text(
        """:root { --bg:#f6f1e8; --ink:#1c1917; --accent:#d97706; }
* { box-sizing: border-box; }
body { margin:0; font-family: "Hiragino Sans", "Noto Sans JP", sans-serif; background:
  radial-gradient(1000px 500px at 10% -10%, #fde68a55, transparent),
  linear-gradient(180deg, #fff7ed, var(--bg)); color: var(--ink); }
.wrap { max-width: 720px; margin: 0 auto; padding: 40px 20px 80px; }
.brand { letter-spacing: .2em; font-weight: 800; color: var(--accent); margin:0 0 8px; }
h1 { font-size: clamp(1.4rem, 3vw, 2rem); line-height:1.35; margin:0 0 12px; }
.lead { opacity:.85; line-height:1.7; }
.panel { margin-top: 28px; display:grid; gap:10px; }
label { font-size:12px; font-weight:700; opacity:.7; }
textarea { width:100%; padding:12px; border:1px solid #29252455; border-radius:6px; font: inherit; background:#fffefb; }
.row { display:flex; gap:10px; flex-wrap:wrap; }
button { background: var(--accent); color:#1c1917; border:0; font-weight:800; padding:12px 18px; border-radius:6px; cursor:pointer; }
button.ghost { background: transparent; border:1px solid #29252466; }
.foot { margin-top: 28px; font-size:13px; opacity:.7; }
a { color: #9a3412; }
""",
        encoding="utf-8",
    )
    (app / "app.js").write_text(
        f"""const input = document.getElementById('input');
const output = document.getElementById('output');
document.getElementById('run').addEventListener('click', () => {{
  const text = (input.value || '').trim();
  const lines = text ? text.split(/\\n+/).filter(Boolean) : ['（入力例を入れて生成してください）'];
  output.value = [
    '【{title}】',
    '',
    ...lines.map((l, i) => `${{i + 1}}. ${{l}}`),
    '',
    '— 知多丸 / 積み上げログ',
    '※必要に応じて文言を調整してください。'
  ].join('\\n');
}});
document.getElementById('copy').addEventListener('click', async () => {{
  if (!output.value) return;
  await navigator.clipboard.writeText(output.value);
  alert('コピーしました');
}});
""",
        encoding="utf-8",
    )


def write_template(repo: Path, p: dict) -> None:
    docs = repo / "docs"
    docs.mkdir(exist_ok=True)
    (docs / "TEMPLATE.md").write_text(
        f"""# {p['title']} — テンプレート

## 使い方
1. このファイルを複製する（または CSV をスプレッドシートへインポート）
2. 自分の運用に合わせて列を増減する
3. 週次 / 月次で見直す

## 項目例
| 日付 | 内容 | メモ | 完了 |
|------|------|------|------|
| YYYY-MM-DD | | | ☐ |

## チェックリスト
{chr(10).join(f'- [ ] {f}' for f in p['features'])}
""",
        encoding="utf-8",
    )
    (docs / "data.csv").write_text(
        "date,item,amount,note,done\n2026-01-01,サンプル,0,初期行,no\n",
        encoding="utf-8",
    )


def write_guide(repo: Path, p: dict) -> None:
    docs = repo / "docs"
    docs.mkdir(exist_ok=True)
    body = "\n".join(f"## {f}\n\n（ここに実践手順を追記）\n" for f in p["features"])
    (docs / "GUIDE.md").write_text(
        f"""# {p['title']}

{p['desc']}

{body}

---
知多丸 / 積み上げログ
""",
        encoding="utf-8",
    )


def write_monthly(repo: Path, p: dict) -> None:
    write_tool(repo, p)
    (repo / "docs").mkdir(exist_ok=True)
    (repo / "docs" / "PRICING.md").write_text(
        f"""# 料金

- 月額: {p['price']}
- 無料枠: 閲覧のみ（想定）
- 解約: いつでも可（決済基盤に準拠）

## MVPスコープ
{chr(10).join(f'- {f}' for f in p['features'])}
""",
        encoding="utf-8",
    )


def write_b2b(repo: Path, p: dict) -> None:
    docs = repo / "docs"
    docs.mkdir(exist_ok=True)
    (docs / "OFFER.md").write_text(
        f"""# {p['title']} — 提供メニュー

価格目安: {p['price']}

## 提供内容
{chr(10).join(f'- {f}' for f in p['features'])}

## 問い合わせ
- ストア: https://syunnjack.dev/store
- BOOTH/フォーム: 準備中

## 免責
掲載効果を保証するものではありません。
""",
        encoding="utf-8",
    )
    write_tool(repo, p)


def write_content(repo: Path, p: dict) -> None:
    content = repo / "content"
    content.mkdir(exist_ok=True)
    (content / "OUTLINE.md").write_text(
        f"""# {p['title']} — 構成案

{p['desc']}

## チャプター
{chr(10).join(f'{i+1}. {f}' for i, f in enumerate(p['features']))}

## 原稿メモ
（ここに本文・台本・問題データを追加）
""",
        encoding="utf-8",
    )


WRITERS = {
    "tool": write_tool,
    "template": write_template,
    "guide": write_guide,
    "monthly": write_monthly,
    "b2b": write_b2b,
    "content": write_content,
}


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")


def generate_store_ts(existing_path: Path) -> str:
    """Merge existing products with new ones; new ones ordered by rank first in recommend section via recommendRank."""
    # Keep existing file content for the original 16, append new products array export
    existing = existing_path.read_text(encoding="utf-8") if existing_path.exists() else ""

    cats = [
        ('"affiliate"', "アフィリエイト・収益化"),
        ('"seo-ops"', "SEO・サイト運用"),
        ('"resale"', "せどり・買取・在庫"),
        ('"hotel"', "終電・ホテル・移動"),
        ('"life-learn"', "生活・学習・習慣化"),
        ('"content"', "コンテンツ制作"),
        ('"realestate"', "不動産・投資"),
        ('"hobby"', "趣味・推し活・地域"),
        ('"b2b"', "B2B・店舗・業務"),
    ]

    lines: list[str] = []
    lines.append("export interface StoreProduct {")
    lines.append("  slug: string")
    lines.append("  category: string")
    lines.append("  emoji: string")
    lines.append("  label: string")
    lines.append("  sublabel: string")
    lines.append("  gradient: string")
    lines.append("  badge: string")
    lines.append("  title: string")
    lines.append("  description: string")
    lines.append("  features: string[]")
    lines.append("  boothUrl: string")
    lines.append("  price: string")
    lines.append("  priceNote: string")
    lines.append("  trialUrl: string | null")
    lines.append("  trialLabel: string | null")
    lines.append("  repoUrl: string")
    lines.append("  recommendRank?: number")
    lines.append("  ideaId?: string")
    lines.append("}")
    lines.append("")
    lines.append("export const storeProductCategories = [")
    for cid, label in cats:
        lines.append(f'  {{ id: {cid}, label: "{label}" }},')
    lines.append("] as const")
    lines.append("")
    lines.append("/** 既存16製品 + 新規おすすめ順製品 */")
    lines.append("export const storeProducts: StoreProduct[] = [")

    # parse existing products roughly by keeping them from old file between storeProducts = [ and final ]
    # Simpler: embed a minimal pointer — read old products by exec? 
    # We'll include existing 16 by importing from a snapshot file generated separately.
    return "\n".join(lines)


def emit_product_ts(p: dict, is_new: bool = True) -> str:
    feats = ",\n".join(f'      "{f}"' for f in p["features"])
    note = f"{p['price']}（税込目安）| 知多丸 / BOOTH販売予定"
    if p["form"] == "M":
        note = f"月額 {p['price']}（税込目安）| 準備中→公開"
    elif p["form"] == "S":
        note = f"{p['price']} | B2B・掲載・代行 | 問い合わせ準備中"
    elif p["form"] == "P":
        note = f"{p['price']}（税込目安）| 講座・PPV・ガイド"
    repo = f"https://github.com/syunnjack/{repo_name(p['slug'])}"
    return f"""  {{
    slug: "{p['slug']}",
    category: "{p['category']}",
    emoji: "{p['emoji']}",
    label: "{p['title'][:24]}",
    sublabel: "{p['sublabel']}",
    gradient: "{GRADIENTS[p['category']]}",
    badge: "{p['badge']}",
    title: "{p['title']}",
    description:
      "{p['desc']}",
    features: [
{feats}
    ],
    boothUrl: "https://chitamaru.booth.pm/items/{p['slug']}",
    price: "{p['price']}",
    priceNote: "{note}",
    trialUrl: null,
    trialLabel: null,
    repoUrl: "{repo}",
    recommendRank: {p['rank']},
    ideaId: "{p['id']}",
  }},"""


def main() -> None:
    REPOS.mkdir(parents=True, exist_ok=True)
    CATALOG.mkdir(parents=True, exist_ok=True)

    # catalog json
    catalog = []
    for p in PRODUCTS:
        catalog.append(
            {
                **{k: p[k] for k in ("rank", "id", "slug", "title", "price", "form", "category", "kind", "emoji", "badge", "sublabel", "desc", "features")},
                "repo": repo_name(p["slug"]),
                "boothUrl": f"https://chitamaru.booth.pm/items/{p['slug']}",
                "repoUrl": f"https://github.com/syunnjack/{repo_name(p['slug'])}",
            }
        )
    (CATALOG / "new-products.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    for p in PRODUCTS:
        name = repo_name(p["slug"])
        repo = REPOS / name
        write_common(repo, p)
        WRITERS[p["kind"]](repo, p)
        # init git if needed
        if not (repo / ".git").exists():
            subprocess.run(["git", "init", "-b", "main"], cwd=repo, check=True, capture_output=True)
            subprocess.run(["git", "add", "-A"], cwd=repo, check=True, capture_output=True)
            subprocess.run(
                ["git", "-c", "user.email=chitamaru@syunnjack.dev", "-c", "user.name=Chitamaru Bot",
                 "commit", "-m", f"Initial scaffold: {p['title']}"],
                cwd=repo,
                check=True,
                capture_output=True,
            )

    # Load existing 16 from store-products.ts — keep as LEGACY block by reading file
    legacy_path = ROOT / "store-products.ts"
    legacy_body = legacy_path.read_text(encoding="utf-8")
    # Extract array entries between first `export const storeProducts` `[` and matching — use regex split
    start = legacy_body.find("export const storeProducts: StoreProduct[] = [")
    end = legacy_body.rfind("]")
    legacy_items = ""
    if start != -1 and end != -1:
        inner = legacy_body[start:end]
        # strip the declaration line
        bracket = inner.find("[")
        legacy_items = inner[bracket + 1 :].rstrip() + "\n"

    # Build new store-products.ts
    out: list[str] = []
    out.append("export interface StoreProduct {")
    out.append("  slug: string")
    out.append("  category: string")
    out.append("  emoji: string")
    out.append("  label: string")
    out.append("  sublabel: string")
    out.append("  gradient: string")
    out.append("  badge: string")
    out.append("  title: string")
    out.append("  description: string")
    out.append("  features: string[]")
    out.append("  boothUrl: string")
    out.append("  price: string")
    out.append("  priceNote: string")
    out.append("  trialUrl: string | null")
    out.append("  trialLabel: string | null")
    out.append("  repoUrl: string")
    out.append("  recommendRank?: number")
    out.append("  ideaId?: string")
    out.append("}")
    out.append("")
    out.append("export const storeProductCategories = [")
    for cid, label in [
        ("affiliate", "アフィリエイト・収益化"),
        ("seo-ops", "SEO・サイト運用"),
        ("resale", "せどり・買取・在庫"),
        ("hotel", "終電・ホテル・移動"),
        ("life-learn", "生活・学習・習慣化"),
        ("content", "コンテンツ制作"),
        ("realestate", "不動産・投資"),
        ("hobby", "趣味・推し活・地域"),
        ("b2b", "B2B・店舗・業務"),
    ]:
        out.append(f'  {{ id: "{cid}", label: "{label}" }},')
    out.append("] as const")
    out.append("")
    out.append("/** おすすめ順（新規78）— store 先頭セクション用 */")
    out.append("export const recommendedNewProducts: StoreProduct[] = [")
    for p in sorted(PRODUCTS, key=lambda x: x["rank"]):
        out.append(emit_product_ts(p))
    out.append("]")
    out.append("")
    out.append("/** 全製品（既存ライン + 新規）。カテゴリ表示はこちらを使用 */")
    out.append("export const storeProducts: StoreProduct[] = [")
    out.append("  // ── 既存16製品 ──")
    out.append(legacy_items.rstrip())
    if not legacy_items.strip().endswith(","):
        out.append(",")
    out.append("  // ── 新規おすすめ製品 ──")
    out.append("  ...recommendedNewProducts,")
    out.append("]")
    out.append("")

    legacy_path.write_text("\n".join(out) + "\n", encoding="utf-8")

    # manifest for push script
    (CATALOG / "repo-manifest.txt").write_text(
        "\n".join(repo_name(p["slug"]) for p in sorted(PRODUCTS, key=lambda x: x["rank"])) + "\n",
        encoding="utf-8",
    )
    print(f"Generated {len(PRODUCTS)} product repos under {REPOS}")
    print(f"Updated {legacy_path}")


if __name__ == "__main__":
    main()
