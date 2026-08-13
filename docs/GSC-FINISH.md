# GSC ロールアウト完了手順（残りのみ）

最終更新: 2026-08-13

## エージェント側で完了済み

| 項目 | 状態 |
|------|------|
| shudenhotel.jp https canonical / GA4 / GSC / FAQ / noindex search | ✅ 本番反映（PR #34/#35） |
| 他4サイト向けパッチ作成・`git am` 検証 | ✅ 4/4 成功 |
| IndexNow（darekore / machi-list / busselect） | ✅ 送信済 |
| 監視 workflow / apply workflow / 一発スクリプト | ✅ master 投入済 |
| ブラウザでの GitHub / GSC / ChatGPT 操作 | ❌ 未ログインのため不可 |
| 他リポジトリへの push | ❌ cursor[bot] 403 |

## あなたが1コマンドで終わらせる（Windows）

各リポジトリを `C:\Users\syunn\` 配下に clone 済み、かつ `gh auth login` 済みなら:

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\complete-gsc-rollout.ps1
```

これが行うこと:
1. 4サイトへパッチ適用 → push → PR → 可能ならマージ
2. ライブ信号チェック
3. IndexNow 再送

## それでも残る手動2点

### A. busselect Site Creator（必須）

ChatGPT → Sites → busselect → Environment:

| Key | 操作 |
|-----|------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID` | 日本語 `GA4測定ID` を削除し、実 `G-...` を入れる |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | 日本語プレースホルダを削除し、実トークンを入れる |

未取得ならいったん **変数ごと削除**（パッチ適用後は偽タグが出なくなる）。その後 Search Console で HTML タグを取り直して再設定。

### B. Search Console サイトマップ再送信（必須・各2分）

https://search.google.com/search-console

| プロパティ | 送信 URL |
|------------|----------|
| shudenhotel.jp | `https://shudenhotel.jp/sitemap.xml` |
| darekore.jp | `https://darekore.jp/sitemap.xml` |
| goalpilot.jp | `https://goalpilot.jp/sitemap.xml` |
| machi-list.jp | `https://machi-list.jp/sitemap.xml` |
| busselect.jp | `https://busselect.jp/sitemap.xml` |

## 代替: GitHub Actions

1. classic PAT（`repo`）を発行
2. rakuten02 Secret `CROSS_REPO_PAT` に保存
3. Actions → **Apply GSC patches to site repos** → Run

## 完了判定

```powershell
.\scripts\site-analytics\check-sites.ps1
# または
bash scripts/site-analytics/check-gsc-signals.sh
```

期待: 5サイトとも critical=0（busselect は実トークン設定後）。
