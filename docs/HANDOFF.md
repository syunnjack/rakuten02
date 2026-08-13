# プロジェクト引き継ぎ — 2026-08-12 更新

**残り作業一覧:** `docs/REMAINING-WORK.md`  
**GSC 改善ログ:** `docs/GSC-PERFORMANCE.md`

---

## A. カスタムドメイン — 現状（ライブ確認 2026-08-12）

| サイト | ドメイン | 公開 | GA4 | GSC | 残り |
|--------|----------|------|-----|-----|------|
| 終電ホテル | shudenhotel.jp | ✅ | ✅ | ✅ | https canonical 等のコード修正をデプロイ |
| ダレコレ | darekore.jp | ✅ | ✅ | ✅ | SEO PR（title / noindex query / sitemap） |
| GoalPilot | goalpilot.jp | ✅ | ✅ | ✅ | sitemap / OG / robots PR |
| 町リスト | machi-list.jp | ✅ HTTPS | ✅ | ✅ | robots 競合・VC SID 修正（GA4 注入済） |
| バスセレクト | busselect.jp | ✅ | ❌ | ❌ | プレースホルダ除去＋Site Creator 実トークン |

### busselect パッチ履歴

| パッチ | 内容 | 状態 |
|--------|------|------|
| 0002 | GA4 / GSC / IndexNow | ✅ 適用済だが env がプレースホルダ |
| 0003 | Leaflet ルート地図 | ✅ 本番確認済 |
| 0004 | Windows `npm run dev` | 任意 |
| 0005 | placeholder 拒否 + title absolute | 本ラウンド |

---

## B. DTI CSV・動画サイト

| リポジトリ | 状態 | 次 |
|------------|------|-----|
| hey-douga-guide | PR #1 マージ済 | 本番 migrate + import |
| free-sample-hub | 未セットアップ | `patches/free-sample-hub/SETUP.md` |

---

## C. ランキングサイト（41 リポジトリ）

GitHub のみ・未デプロイ。`docs/RANKING-SITES.md`

---

## 確認コマンド

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\check-sites.ps1
```
