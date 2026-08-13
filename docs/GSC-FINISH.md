# GSC ロールアウト完了手順（残りのみ）

最終更新: 2026-08-13

## エージェント側で完了済み

| 項目 | 状態 |
|------|------|
| shudenhotel.jp https / GA4 / GSC / FAQ / noindex search | ✅ 本番 |
| 大阪・京都・名古屋ランディング + ItemList + robots Disallow /search | ✅（本 PR） |
| IndexNow key（早期 middleware + CDN cache） | ✅（本 PR 以降） |
| IndexNow Yandex 受理（shudenhotel 含む） | ✅ |
| 他4サイト向けパッチ + `git am` 検証 | ✅ |
| IndexNow（darekore / machi-list / busselect → Bing 200） | ✅ |
| 監視 / apply / completer / sitemap-auto | ✅ master |
| 他リポジトリ push / GSC UI / Site Creator / Bing Webmaster | ❌ 認証・権限不足 |

## 最短完了（オーナー1コマンド）

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\complete-gsc-rollout.ps1
```

Linux / Git Bash:

```bash
cd ~/rakuten02   # or your clone
git pull origin master
export CROSS_REPO_PAT=ghp_...   # classic PAT with repo scope
bash scripts/site-analytics/complete-gsc-rollout.sh
```

スクリプトが行うこと:
1. 既存の有益な Devin PR をマージ試行  
   - [kousokubus-benri#1](https://github.com/syunnjack/kousokubus-benri/pull/1)  
   - [task-dashboard#8](https://github.com/syunnjack/task-dashboard/pull/8)  
   - [machi-list#1](https://github.com/syunnjack/machi-list/pull/1)  
   - [goal-pilot-app#1](https://github.com/syunnjack/goal-pilot-app/pull/1)  
   - DTI: hey-douga-guide #2/#3/#4, free-sample-hub #1
2. rakuten02 パッチ `0005/0005/0003/0002` を適用 → PR → マージ
3. ライブ信号チェック + IndexNow（Bing + Yandex）

UI で先にマージする場合も同じ4 PR でOK（その後スクリプト再実行）。

## 手動3点（スクリプト後）

### A. busselect Site Creator

| Key | 操作 |
|-----|------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID` | `GA4測定ID` を削除 → 実 `G-...` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 日本語プレースホルダ削除 → 実トークン |

未取得なら **変数ごと削除**（パッチ適用後は偽タグが出ない）。

### B. Search Console サイトマップ再送信

| プロパティ | URL |
|------------|-----|
| shudenhotel.jp | `https://shudenhotel.jp/sitemap.xml` |
| darekore.jp | `https://darekore.jp/sitemap.xml` |
| goalpilot.jp | `https://goalpilot.jp/sitemap.xml` |
| machi-list.jp | `https://machi-list.jp/sitemap.xml` |
| busselect.jp | `https://busselect.jp/sitemap.xml` |

### C. Bing Webmaster（shudenhotel IndexNow 403 解消）

Bing `api.indexnow.org` は key ファイルが 200 でも、ドメイン未バインドだと `UserForbiddedToAccessSite` を返す。  
[Bing Webmaster Tools](https://www.bing.com/webmasters) で `shudenhotel.jp` を検証すると解消する（または Bingbot が key を自然発見するまで 1–7 日）。  
Yandex IndexNow は既に 200/202 で受理済み。

## 代替: Actions

Secret `CROSS_REPO_PAT` → **Apply GSC patches to site repos**

## 完了判定

```powershell
.\scripts\site-analytics\check-sites.ps1
# または
bash scripts/site-analytics/check-gsc-signals.sh
```

期待: `critical=0`（busselect は実トークン設定後）。
