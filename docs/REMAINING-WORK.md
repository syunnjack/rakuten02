# 残り作業チェックリスト — 2026-08-12 更新

ライブ確認済み。✅ = 完了 / 🟡 = 進行中 / ❌ = 未着手

GSC 改善の詳細: `docs/GSC-PERFORMANCE.md`

---

## トラック A — カスタムドメイン（5サイト）

| サイト | 公開 | GA4 | GSC | 残り |
|--------|------|-----|-----|------|
| shudenhotel.jp | ✅ | ✅ | ✅ | **デプロイ待ち**（https canonical / search noindex / IndexNow / HEAD） |
| darekore.jp | ✅ | ✅ | ✅ | title/og/noindex/`/?q=`/sitemap encode PR |
| goalpilot.jp | ✅ | ✅ | ✅ | sitemap 拡充・OG・robots 残骸削除 PR |
| machi-list.jp | ✅ HTTPS | ✅ | ✅ | robots 競合修正・VC SID 修正 PR（GA4 は live） |
| busselect.jp | ✅ | ❌ placeholder | ❌ placeholder | env 検証＋title 修正 PR / Site Creator 実トークン設定 |

### ブラウザ作業（Search Console）

1. https://search.google.com/search-console
2. 各ドメイン → **サイトマップ** 再送信:
   - `https://shudenhotel.jp/sitemap.xml`（デプロイ後）
   - `https://darekore.jp/sitemap.xml`
   - `https://goalpilot.jp/sitemap.xml`
   - `https://machi-list.jp/sitemap.xml`
   - `https://busselect.jp/sitemap.xml`
3. busselect: Site Creator の `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID` / `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` を実値に更新し再デプロイ

---

## トラック B — DTI 動画サイト

| リポジトリ | 状態 | 残り |
|------------|------|------|
| hey-douga-guide | PR #1 マージ済 | **本番サーバー** migrate + import |
| free-sample-hub | 未セットアップ | パッチ 0001–0003 適用 |

---

## トラック C — ランキングサイト（41 repo）

未デプロイ。ドメイン割当・デプロイ方針の相談待ち。`docs/RANKING-SITES.md`

---

## 一括確認

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\check-sites.ps1
```
