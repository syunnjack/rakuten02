# 残り作業チェックリスト — 2026-08-13 更新

GSC 詳細: `docs/GSC-PERFORMANCE.md` / 完了手順: `docs/GSC-FINISH.md`

---

## トラック A — カスタムドメイン（5サイト）

| サイト | 公開 | GA4 | GSC | 残り |
|--------|------|-----|-----|------|
| shudenhotel.jp | ✅ | ✅ | ✅ | GSC sitemap 再送信 / Bing Webmaster（IndexNow） |
| darekore.jp | ✅ | ✅ | ✅ | パッチ `0005`+`0006` + Devin #8 |
| goalpilot.jp | ✅ | ✅ | ✅ | パッチ `0002`+`0003`（ページ単位 canonical / FAQ / IndexNow） |
| machi-list.jp | ✅ | ✅ | ✅ | パッチ `0003`+`0004` + Devin #1（YOUR_VC_* / FAQ / 店舗詳細） |
| busselect.jp | ✅ | ❌ placeholder | ✅ タグ有効 | パッチ `0005`+`0006` + Site Creator 実 GA4 |

### 最短ルート

```powershell
cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\complete-gsc-rollout.ps1
```

または Secret `CROSS_REPO_PAT` → Actions **Apply GSC patches to site repos**

その後:
1. busselect Site Creator の `NEXT_PUBLIC_GOOGLE_*` を実値（または削除）
2. Search Console で sitemap ×5 再送信
3. Bing Webmaster で shudenhotel.jp 検証

---

## トラック B — DTI 動画サイト

| リポジトリ | 本番 | 状態 | 残り |
|------------|------|------|------|
| hey-douga-guide | sosoru.org | GA4/GSC ライブ。パッチ 0003–0005 = Devin #2/#3/#4 | マージ + migrate |
| free-sample-hub | sosoru.asia | GA4/GSC ライブ。パッチ `0004` = Devin #1 | マージ + migrate |

```bash
# Prefer: merges Devin PRs then git am leftovers
bash scripts/site-analytics/apply-dti-patches.sh
# or
bash scripts/site-analytics/complete-dti-rollout.sh
# dry-run
PUSH=false MERGE_EXISTING_PRS=false bash scripts/site-analytics/apply-dti-patches.sh
```

---

## トラック C — ランキングサイト

**多くは本番稼働中**（未デプロイではない）。台帳: `docs/RANKING-SITES.md` / `docs/XSERVER-DEPLOY.md`

| グループ | 残り |
|----------|------|
| ColorfulBOX 10 | trailing-slash canonical パッチ適用 / 3 件の API キー復旧（duga/gravure/mature） / GA4 `.env` 3 件 |
| WPX 17 | DNS を本番サーバーへ |

Canonical パッチ: `patches/ranking-sites/README.md`

```bash
PUSH=false bash scripts/site-analytics/apply-ranking-canonical-patches.sh
bash scripts/site-analytics/check-ranking-signals.sh
```
