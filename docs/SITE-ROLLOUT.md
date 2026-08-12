# 全サイト ロールアウト手順

最終確認: **2026-08-12**

マスター台帳: `docs/HANDOFF.md` / 残り作業: `docs/REMAINING-WORK.md` / GSC: `docs/GSC-PERFORMANCE.md`

## 現状スナップショット

| サイト | 公開 | GA4 | GSC | 次のアクション |
|--------|------|-----|-----|----------------|
| shudenhotel.jp | ✅ | ✅ | ✅ | **本リポジトリ修正をデプロイ** → sitemap 再送信 |
| darekore.jp | ✅ | ✅ | ✅ | SEO PR マージ + sitemap 再送信 |
| goalpilot.jp | ✅ | ✅ | ✅ | SEO PR マージ + sitemap 再送信 |
| machi-list.jp | ✅ HTTPS | ✅ | ✅ | robots/VC 修正 PR マージ |
| busselect.jp | ✅ | ❌ placeholder | ❌ placeholder | env 実値 + placeholder ガード PR |

一括確認:

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\check-sites.ps1
```
