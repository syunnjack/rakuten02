# 残り作業チェックリスト — 2026-08-13 更新

GSC 詳細: `docs/GSC-PERFORMANCE.md` / 完了手順: `docs/GSC-FINISH.md`

---

## トラック A — カスタムドメイン（5サイト）

| サイト | 公開 | GA4 | GSC | 残り |
|--------|------|-----|-----|------|
| shudenhotel.jp | ✅ | ✅ | ✅ | GSC sitemap 再送信 / Bing Webmaster（IndexNow） |
| darekore.jp | ✅ | ✅ | ✅ | パッチ `0005` + Devin #8 |
| goalpilot.jp | ✅ | ✅ | ✅ | パッチ `0002` + Devin #1 |
| machi-list.jp | ✅ | ✅ | ✅ | パッチ `0003`（YOUR_VC_*） |
| busselect.jp | ✅ | ❌ placeholder | ❌ placeholder | パッチ `0005` + Devin #1 + Site Creator |

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

| リポジトリ | 状態 | 残り |
|------------|------|------|
| hey-douga-guide | PR #1 マージ済 | 本番 migrate + import |
| free-sample-hub | 未セットアップ | パッチ 0001–0003 |

---

## トラック C — ランキングサイト（41 repo）

未デプロイ。`docs/RANKING-SITES.md`
