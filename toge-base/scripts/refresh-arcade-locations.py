#!/usr/bin/env python3
"""Refresh Initial D arcade cabinet locations from ALL.Net into app/arcades/locations.json."""

from __future__ import annotations

import json
import re
import time
import urllib.request
from datetime import date
from html import unescape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app" / "arcades" / "locations.json"

PREFECTURES = [
    (0, "hokkaido", "北海道", "hokkaido-tohoku"),
    (1, "aomori", "青森県", "hokkaido-tohoku"),
    (2, "iwate", "岩手県", "hokkaido-tohoku"),
    (3, "miyagi", "宮城県", "hokkaido-tohoku"),
    (4, "akita", "秋田県", "hokkaido-tohoku"),
    (5, "yamagata", "山形県", "hokkaido-tohoku"),
    (6, "fukushima", "福島県", "hokkaido-tohoku"),
    (7, "ibaraki", "茨城県", "kanto"),
    (8, "tochigi", "栃木県", "kanto"),
    (9, "gunma", "群馬県", "kanto"),
    (10, "saitama", "埼玉県", "kanto"),
    (11, "chiba", "千葉県", "kanto"),
    (12, "tokyo", "東京都", "kanto"),
    (13, "kanagawa", "神奈川県", "kanto"),
    (14, "niigata", "新潟県", "chubu"),
    (15, "toyama", "富山県", "chubu"),
    (16, "ishikawa", "石川県", "chubu"),
    (17, "fukui", "福井県", "chubu"),
    (18, "yamanashi", "山梨県", "chubu"),
    (19, "nagano", "長野県", "chubu"),
    (20, "gifu", "岐阜県", "chubu"),
    (21, "shizuoka", "静岡県", "chubu"),
    (22, "aichi", "愛知県", "chubu"),
    (23, "mie", "三重県", "chubu"),
    (24, "shiga", "滋賀県", "kinki"),
    (25, "kyoto", "京都府", "kinki"),
    (26, "osaka", "大阪府", "kinki"),
    (27, "hyogo", "兵庫県", "kinki"),
    (28, "nara", "奈良県", "kinki"),
    (29, "wakayama", "和歌山県", "kinki"),
    (30, "tottori", "鳥取県", "chugoku-shikoku"),
    (31, "shimane", "島根県", "chugoku-shikoku"),
    (32, "okayama", "岡山県", "chugoku-shikoku"),
    (33, "hiroshima", "広島県", "chugoku-shikoku"),
    (34, "yamaguchi", "山口県", "chugoku-shikoku"),
    (35, "tokushima", "徳島県", "chugoku-shikoku"),
    (36, "kagawa", "香川県", "chugoku-shikoku"),
    (37, "ehime", "愛媛県", "chugoku-shikoku"),
    (38, "kochi", "高知県", "chugoku-shikoku"),
    (39, "fukuoka", "福岡県", "kyushu-okinawa"),
    (40, "saga", "佐賀県", "kyushu-okinawa"),
    (41, "nagasaki", "長崎県", "kyushu-okinawa"),
    (42, "kumamoto", "熊本県", "kyushu-okinawa"),
    (43, "oita", "大分県", "kyushu-okinawa"),
    (44, "miyazaki", "宮崎県", "kyushu-okinawa"),
    (45, "kagoshima", "鹿児島県", "kyushu-okinawa"),
    (46, "okinawa", "沖縄県", "kyushu-okinawa"),
]

REGION_LABELS = {
    "hokkaido-tohoku": "北海道・東北",
    "kanto": "関東",
    "chubu": "中部",
    "kinki": "近畿",
    "chugoku-shikoku": "中国・四国",
    "kyushu-okinawa": "九州・沖縄",
}

UA = {"User-Agent": "Mozilla/5.0 (compatible; TOGEBASEBot/0.1; +https://togepass.jp/)"}


def fetch(at: int) -> str:
    url = f"https://location.am-all.net/alm/location?at={at}&ct=1000&gm=105"
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as response:
        return response.read().decode("utf-8", "replace")


def parse_stores(html: str, pref_name: str) -> list[dict[str, str]]:
    cut = html
    marker = re.search(r"選択エリア：", html)
    if marker:
        cut = html[marker.start() :]
    cut = re.sub(r"<script\b[^>]*>.*?</script>", "", cut, flags=re.S | re.I)

    stores: list[dict[str, str]] = []
    for li in re.findall(r"<li[^>]*>(.*?)</li>", cut, re.S | re.I):
        text = re.sub(r"<[^>]+>", " ", li)
        text = unescape(re.sub(r"\s+", " ", text)).strip()
        text = (
            text.replace("GoogleMapで見る", "")
            .replace("詳細へ", "")
            .replace("詳細", "")
            .strip()
        )
        text = re.sub(r"\s+", " ", text)
        if pref_name not in text or len(text) < 8 or len(text) > 140:
            continue
        idx = text.find(pref_name)
        if idx <= 0:
            continue
        name = text[:idx].strip(" 　-–—|")
        if "）" in name and any(token in name for token in ["店舗", "選択エリア"]):
            name = name.split("）")[-1].strip()
        if any(token in name for token in ["Language", "gtm", "選択", "店舗検索"]):
            chunk = text[:idx].strip()
            match = re.search(r"([^\s]{2,40})\s*$", chunk)
            name = match.group(1) if match else name
        address = text[idx:].strip()
        if not name or len(name) < 2 or len(name) > 50 or pref_name in name:
            continue
        stores.append({"name": name, "address": address})

    unique: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()
    for store in stores:
        key = (store["name"], store["address"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(store)
    return unique


def main() -> None:
    prefectures = []
    for at, slug, name, region in PREFECTURES:
        stores = parse_stores(fetch(at), name)
        print(f"{name}: {len(stores)}")
        prefectures.append(
            {
                "slug": slug,
                "name": name,
                "region": region,
                "regionLabel": REGION_LABELS[region],
                "allNetCode": at,
                "storeCount": len(stores),
                "source": f"https://location.am-all.net/alm/location?at={at}&ct=1000&gm=105",
                "stores": stores,
            }
        )
        time.sleep(0.25)

    payload = {
        "title": "頭文字D THE ARCADE 設置店舗（全国）",
        "updated": date.today().isoformat(),
        "source": "https://location.am-all.net/alm/location?gm=105",
        "sourceLabel": "ALL.Net 設置店舗検索",
        "disclaimer": "ALL.Netのネットワーク接続状況に基づく参考リストです。最新の稼働・営業状況は公式の設置店舗検索および各店舗へご確認ください。本サイトは非公式です。",
        "regions": REGION_LABELS,
        "totalStores": sum(item["storeCount"] for item in prefectures),
        "prefectures": prefectures,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {OUT} ({payload['totalStores']} stores)")


if __name__ == "__main__":
    main()
