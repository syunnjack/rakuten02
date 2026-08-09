# busselect — パッチ 0003: Leaflet ルート地図

**対象:** `syunnjack/kousokubus-benri`  
**内容:** 到着後ルート検索（`/onward`）の結果を **Leaflet + OpenStreetMap** で地図表示

---

## 適用

```powershell
cd C:\Users\syunn\kousokubus-benri
git pull origin main
curl.exe -L -o leaflet.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/kousokubus-benri/0003-Add-Leaflet-route-map-for-onward-search.patch"
git am leaflet.patch
npm install
git push origin main
```

Site Creator 連携の場合、push 後に自動再デプロイされます。

---

## 変更概要

| ファイル | 内容 |
|----------|------|
| `lib/geocode.ts` | Nominatim で住所ジオコーディング、OSRM でルート polyline 取得 |
| `app/onward/route-map.tsx` | Leaflet 地図コンポーネント（降車地 A / 目的地 B） |
| `app/onward/planner.tsx` | 検索結果に地図を表示 |
| `app/api/onward/route.ts` | API レスポンスに `map` フィールド追加 |
| `package.json` | `leaflet`, `@types/leaflet` 追加 |

---

## 確認

1. `/onward` を開く
2. 降車地・目的地を入力 → **ルートを検索**
3. サマリー下に **地図でルートを確認** パネルが表示される

地図タイル: OpenStreetMap  
ルート: OSRM（徒歩プロファイル概算）
