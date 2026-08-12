# プロジェクト引き継ぎ — 2026-08-12 更新

**残り作業一覧:** `docs/REMAINING-WORK.md`（最新チェックリスト）

---

## T. TOGE BASE（イニシャルDポータル）— 2026-08-12 追加

| 項目 | 内容 |
|------|------|
| ソース | `toge-base/`（`wangan-base` 同型） |
| ブランド | TOGE BASE / 想定ドメイン `togepass.jp` |
| 実装 | 攻略LP・UGC・robots/sitemap/llms.txt・JSON-LD |
| 次 | GitHub リポジトリ切り出し → Pages → DNS |

詳細: `toge-base/docs/SETUP-REPO.md` / `patches/toge-base/README.md`

---

## A. カスタムドメイン — 現状（ライブ確認 2026-08-10）

| サイト | ドメイン | 公開 | GA4 | GSC | 残り |
|--------|----------|------|-----|-----|------|
| 終電ホテル | shudenhotel.jp | ✅ | ✅ | ✅ | なし |
| ダレコレ | darekore.jp | ✅ | ✅ | ✅ | **サイトマップ送信** |
| GoalPilot | goalpilot.jp | ✅ | ✅ | ✅ | **サイトマップ送信** |
| 町リスト | machi-list.jp | ✅ HTTPS | ❌ | ✅ | **GA4 Secret + Deploy** |
| バスセレクト | busselect.jp | ✅ | ✅ | ✅ | **サイトマップ送信**（Leaflet 0003 適用済） |

### busselect パッチ履歴

| パッチ | 内容 | 状態 |
|--------|------|------|
| 0002 | GA4 / GSC / IndexNow | ✅ |
| 0003 | Leaflet ルート地図 | ✅ 本番確認済 |
| 0004 | Windows `npm run dev` | 任意（`WINDOWS-DEV.md`） |

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

---

## 主要ファイル

| 用途 | パス |
|------|------|
| **残り作業** | `docs/REMAINING-WORK.md` |
| ドメインロールアウト | `docs/SITE-ROLLOUT.md` |
| machi-list GA4 修正 | `patches/machi-list/POST-DNS-GITHUB-PAGES.md` |
| busselect | `patches/kousokubus-benri/DEPLOY-SITE-CREATOR-DNS.md` |
| DTI Windows | `patches/DEPLOY-WINDOWS.md` |

---

## 関連 PR（rakuten02）

#20–#25 マージ済（busselect パッチ、Leaflet、Windows dev fix 含む）
