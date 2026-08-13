# 残り作業チェックリスト — 2026-08-13 更新

GSC 詳細: `docs/GSC-PERFORMANCE.md`

---

## トラック A — カスタムドメイン（5サイト）

| サイト | 公開 | GA4 | GSC | 残り |
|--------|------|-----|-----|------|
| shudenhotel.jp | ✅ | ✅ | ✅ | Search Console で https sitemap 再送信 / IndexNow 403 解消待ち |
| darekore.jp | ✅ | ✅ | ✅ | パッチ `0005` 適用 |
| goalpilot.jp | ✅ | ✅ | ✅ | パッチ `0002` 適用 |
| machi-list.jp | ✅ | ✅ | ✅ | パッチ `0003` 適用（YOUR_VC_*） |
| busselect.jp | ✅ | ❌ placeholder | ❌ placeholder | パッチ `0005` + Site Creator 実トークン |

### 最短ルート

1. rakuten02 に Secret `CROSS_REPO_PAT` を追加
2. Actions → **Apply GSC patches to site repos** → Run
3. busselect Site Creator の `NEXT_PUBLIC_GOOGLE_*` を実値に
4. Search Console で sitemap ×5 再送信

---

## トラック B — DTI 動画サイト

| リポジトリ | 状態 | 残り |
|------------|------|------|
| hey-douga-guide | PR #1 マージ済 | 本番 migrate + import |
| free-sample-hub | 未セットアップ | パッチ 0001–0003 |

---

## トラック C — ランキングサイト（41 repo）

未デプロイ。`docs/RANKING-SITES.md`
