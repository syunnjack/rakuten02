#!/usr/bin/env python3
"""Generate BOOTH copy-paste listings, per-repo BOOTH.md, and store-products.ts."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
PATCH = ROOT.parent / "patches" / "chitamaru-products"

FOOTER = """---
【ご注意】
・デジタル商品のため、購入後の返品・キャンセルはお受けできません。
・デモの空室・求人・価格はサンプルです。予約・応募前は必ず公式情報を確認してください。
・サポートは購入後メッセージにて対応します（通常48時間以内）。

知多丸（Chitamaru）／積み上げログ
https://syunnjack.dev/store
https://chitamaru.booth.pm
"""

FORM_LABEL = {"B": "買い切り ZIP", "M": "月額（準備中）", "S": "B2Bデモ＋案内", "P": "PPVチケット"}

CATEGORY_MAP = {
    "hotel": "hotel",
    "job": "life-learn",
    "biz": "b2b",
    "b2b": "b2b",
    "local": "hobby",
    "travel": "hotel",
    "content": "content",
    "seo-ops": "seo-ops",
    "affiliate": "affiliate",
    "hobby": "hobby",
}

GRADIENT = {
    "hotel": "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
    "job": "linear-gradient(135deg, #0f766e 0%, #134e4a 100%)",
    "biz": "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
    "b2b": "linear-gradient(135deg, #334155 0%, #0f172a 100%)",
    "local": "linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)",
    "travel": "linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)",
    "content": "linear-gradient(135deg, #db2777 0%, #9d174d 100%)",
    "seo-ops": "linear-gradient(135deg, #15803d 0%, #14532d 100%)",
    "affiliate": "linear-gradient(135deg, #a02b36 0%, #6b0f1a 100%)",
    "hobby": "linear-gradient(135deg, #b45309 0%, #78350f 100%)",
}

TAGS = {
    "hotel-price-watch": "ホテル 空室 値下げ 出張 旅行 アラート 買い切り",
    "job-match-alert": "転職 求人 通知 条件一致 副業 買い切り",
    "subsidy-alert-hub": "補助金 助成金 締切 個人事業主 買い切り",
    "nearqueue": "順番待ち 受付番号 店舗 SaaS 美容 飲食",
    "work-bar-navi": "夜職 ガールズバー エリア 求人 ナビ 買い切り",
    "midnight-spot-alert": "終電 サウナ 漫画喫茶 仮眠 ホテル 買い切り",
    "welfare-job-alert": "福祉 障害者雇用 求人 通知 買い切り",
    "busstay": "高速バス ホテル 徒歩圏 到着 旅行 買い切り",
    "trip-route-stay": "旅 ルート 旅程 テンプレ 宿 買い切り",
    "open-close-radar": "開店 閉店 地域 UGC 通知 買い切り",
    "comicstay": "漫画喫茶 ネットカフェ 個室 シャワー 深夜 買い切り",
    "my-dartslive": "ダーツ 施設 大会 クーポン 深夜 買い切り",
    "eki-genre-map": "駅 ジャンル 地元 マップ 発見 買い切り",
    "content-brief-packs": "SEO ブリーフ 不動産 転職 飲食 買い切り",
    "seo-dashboard-agency": "SEO ダッシュボード 制作会社 複数サイト Agency",
    "room-ops-tickets": "楽天ROOM 運用代行 アフィリエイト チケット",
}

PAIN = {
    "hotel-price-watch": ["毎回同じ条件でホテルを検索し直している", "値下げに気づいたときは埋まっている", "出張先の上限金額を保存しておきたい"],
    "job-match-alert": ["求人サイトを何個も巡回している", "締切と面接枠を見逃す", "条件一致だけを通知で回したい"],
    "subsidy-alert-hub": ["締切を過ぎてから制度を知る", "対象かの確認に時間が溶ける", "士業に相談する前に自分で整理したい"],
    "nearqueue": ["店頭の番号札だけだと待ち時間が読めない", "呼び出しを待つ間に動けない", "受付後のクーポン導線がない"],
    "work-bar-navi": ["夜の仕事とお店情報がバラバラ", "エリアをまたいで探せない", "掲載したい店舗の窓口がない"],
    "midnight-spot-alert": ["終電後にホテル以外の選択肢が分からない", "サウナ・漫画喫茶・食事を横断できない", "終電ホテルと併用したい"],
    "welfare-job-alert": ["総合求人だと条件が埋もれる", "配慮条件で絞れない", "福祉領域に特化した通知が欲しい"],
    "busstay": ["高速バス到着後に宿を探すのが遅い", "駅チカ検索だとターミナル徒歩が分からない", "今夜空いている徒歩圏だけ見たい"],
    "trip-route-stay": ["移動・宿・スポットを別々に調べている", "旅程の型がなく毎回ゼロから", "コピーできるドラフトが欲しい"],
    "open-close-radar": ["近所の開店閉店をSNSで偶然知る", "地域の速報を保存できない", "店舗側の露出窓口がない"],
    "comicstay": ["個室・シャワー・深夜で横断検索できない", "口コミが施設サイトに散らばっている", "終電後の滞在先として使いたい"],
    "my-dartslive": ["大会・クーポン・深夜営業を施設横断で見られない", "初回クーポンを逃す", "施設掲載の窓口がない"],
    "eki-genre-map": ["駅の周辺で何があるか一発で出ない", "ジャンル横断の発見が弱い", "ローカル広告の置き場がない"],
    "content-brief-packs": ["業界ごとにブリーフの型を作り直している", "見出しとCTAが毎回ブレる", "¥580で試し買いして横展開したい"],
    "seo-dashboard-agency": ["顧客ごとにスプレッドシートが分かれている", "月次レポの下書きに時間がかかる", "指摘をチケットに落とせない"],
    "room-ops-tickets": ["ROOMツールはあるが毎週の差し替えが続かない", "作業範囲が見積もりにくい", "1回単位で頼みたい"],
}

DELIVER = {
    "B": "ソースZIP（README / src / 使い方）",
    "S": "デモZIP＋導入案内PDF相当の README",
    "P": "チケット申込フォーム＋作業チェックリスト（ZIP）",
    "M": "月額案内（現時点は買い切りデモZIP）",
}

SHIP_FIRST = ["content-brief-packs", "midnight-spot-alert", "trip-route-stay", "open-close-radar"]


def yen_int(price: str) -> str:
    return price.replace("¥", "").replace(",", "")


def listing(p: dict) -> str:
    slug = p["slug"]
    pain = "\n".join(f"・{x}" for x in PAIN[slug])
    feats = "\n".join(f"・{x}" for x in p["features"])
    title = f"【{p['price']}】{p['title']}｜{p['titleJa']}"
    if p["form"] == "P":
        title = f"【1回{p['price']}】{p['title']}｜{p['titleJa']}"
    if p["form"] == "S":
        title = f"【店舗デモ {p['price']}】{p['title']}｜{p['titleJa']}"
    return f"""## {p['rank']}. {p['title']}（{p['titleJa']}）— {p['price']}

| 項目 | 内容 |
|------|------|
| 推奨URLパス | `items/{p['boothItem']}` |
| 価格 | **{yen_int(p['price'])}円（税込）** / {FORM_LABEL[p['form']]} |
| 納品形態 | {DELIVER.get(p['form'], 'ZIP')} |
| 対象 | {p['who']} |
| リポジトリ | `syunnjack/{p['repo']}` |
| Phase | {p['phase']}（1=個人下地 / 3=B2B） |

**商品名（BOOTHタイトル）**

```
{title}
```

**タグ案**  
`{"` `".join(TAGS[slug].split())}`

**短い説明**

```
{p['tagline']} {p['who']}向け。{p['price']}。
```

**本文**

```
■ こんな方へ
{pain}

■ できること
{feats}

■ 納品内容
・{DELIVER.get(p['form'], 'ZIP')}
・デモの開き方（README）
・BOOTH購入後メッセージの使い方3行

■ 動作環境
・最新の Chrome / Edge / Safari
・`npm install && npm run dev` でローカル起動（Node 22 想定）
・ZIP内の説明どおり GitHub Pages でも公開可

■ 購入後の流れ
1. ZIPを解凍
2. README の「開発」に従って起動、または静的ホストへ
3. 画面のウォッチ／保存／コピーを使う

{FOOTER}
```

**購入者メッセージ雛形**

```
ご購入ありがとうございます。知多丸です。

【商品】{p['title']}（{p['titleJa']}）
【価格】{p['price']}

【使い方（最短）】
1. 添付ZIPを解凍
2. README.md を開く
3. npm install && npm run dev

デモ（GitHub公開後）:
https://syunnjack.github.io/{p['repo']}/
ソース:
https://github.com/syunnjack/{p['repo']}

セットアップで詰まった点があれば、このメッセージに返信してください。
```

**出品前チェック**

- [ ] ZIP に README / src / package.json が入っている
- [ ] `npm run build` が通る
- [ ] 価格 {p['price']} / 税込 / デジタル返品不可
- [ ] サンプルデータである旨を本文に書いた
- [ ] ストア `boothUrl` を公開後URLに更新するメモ
"""


def store_ts(products: list[dict]) -> str:
    items = []
    for p in products:
        cat = CATEGORY_MAP[p["category"]]
        badge = FORM_LABEL[p["form"]]
        j = lambda x: json.dumps(x, ensure_ascii=False)
        features = ",\n      ".join(j(f) for f in p["features"])
        items.append(f"""  {{
    slug: {j(p["slug"])},
    category: {j(cat)},
    emoji: {j(p["emoji"])},
    label: {j(p["titleJa"])},
    sublabel: {j(p["tagline"])},
    gradient: {j(GRADIENT[p["category"]])},
    badge: {j(badge)},
    title: {j(p["title"] + "｜" + p["titleJa"])},
    description: {j(p["tagline"] + " " + p["who"] + "向け。")},
    features: [
      {features}
    ],
    boothUrl: {j("https://chitamaru.booth.pm/items/" + p["boothItem"])},
    price: {j(p["price"])},
    priceNote: {j(p["price"] + "（税込目安）| 知多丸 / BOOTH販売予定")},
    trialUrl: {j("https://syunnjack.github.io/" + p["repo"] + "/")},
    trialLabel: "デモを見る",
    repoUrl: {j("https://github.com/syunnjack/" + p["repo"])},
    recommendRank: {p["rank"]},
    ideaId: {json.dumps(p["slug"])},
  }}""")
    body = ",\n".join(items)
    return f"""export const additional16ProductRepos = [
{body}
] as const
"""


def main() -> None:
    products = CATALOG["products"]
    first = [p for p in products if p["slug"] in SHIP_FIRST]
    first.sort(key=lambda p: SHIP_FIRST.index(p["slug"]))
    rest = [p for p in products if p["slug"] not in SHIP_FIRST]

    parts = [
        "# 追加16製品 BOOTH出品パッケージ（コピペ用）",
        "",
        "ショップ: `https://chitamaru.booth.pm` ／ ストア: `https://syunnjack.dev/store`",
        "正本リポ: `products/chitamaru-*`（GitHub 新規作成は `./create-github-repos.sh`）",
        "",
        "## 出品の進め方",
        "",
        "1. `./products/pack-booth-zips.sh` で納品ZIPを作る",
        "2. 下のタイトル・本文・メッセージを BOOTH に貼る",
        "3. ZIPを添付して公開",
        "4. 公開URLが数字IDならストアの `boothUrl` を差し替える",
        "",
        "### 今すぐ出す4本（¥580）",
        "",
        "| 順 | slug | 価格 |",
        "|----|------|------|",
    ]
    for i, p in enumerate(first, 1):
        parts.append(f"| {i} | `{p['slug']}` | {p['price']} |")
    parts += [
        "",
        "### 出品進捗",
        "",
        "| # | slug | 価格 | 形態 | 出品 | URL反映 | 購入テスト |",
        "|---|------|------|------|:----:|:-------:|:---------:|",
    ]
    for p in first + rest:
        parts.append(
            f"| {p['rank']} | `{p['slug']}` | {p['price']} | {FORM_LABEL[p['form']]} | ☐ | ☐ | ☐ |"
        )
    parts.append("\n# 今すぐ出す4本（¥580）\n")
    for p in first:
        parts.append(listing(p))
    parts.append("\n# 本線・高め・B2B\n")
    for p in rest:
        parts.append(listing(p))

    text = "\n".join(parts) + "\n"
    (ROOT / "BOOTH-LISTINGS.md").write_text(text, encoding="utf-8")
    PATCH.mkdir(parents=True, exist_ok=True)
    (PATCH / "store-16-products.ts").write_text(store_ts(products), encoding="utf-8")

    for p in products:
        dest = ROOT / p["repo"] / "docs" / "BOOTH.md"
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(listing(p).replace(f"## {p['rank']}. ", "# ", 1), encoding="utf-8")
        print("updated", dest.relative_to(ROOT.parent))


if __name__ == "__main__":
    main()
