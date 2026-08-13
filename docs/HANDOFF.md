# プロジェクト引き継ぎ — 2026-08-13 更新

**残り作業:** `docs/REMAINING-WORK.md`  
**GSC:** `docs/GSC-PERFORMANCE.md` / **完了手順:** `docs/GSC-FINISH.md`

---

## S. Sitemap Auto（サイトマップ自動送信）

| 項目 | 内容 |
|------|------|
| ソース | `sitemap-auto/`（CLI + GitHub Actions） |
| 単体 repo | [syunnjack/sitemap-auto](https://github.com/syunnjack/sitemap-auto)（空 → `sitemap-auto/docs/SETUP-REPO.md` で初回 push） |
| 機能 | sitemap 差分検知 → GSC API 送信 + IndexNow |
| ストア | 積み上げログ `/store` へ掲載パッチ: `patches/tsumiage-log/` |
| Secret | `GSC_SERVICE_ACCOUNT_JSON` |

---

## A. カスタムドメイン

| サイト | 公開 | GA4 | GSC | 残り |
|--------|------|-----|-----|------|
| shudenhotel.jp | ✅ | ✅ | ✅ | Search Console で https sitemap 再送信 |
| darekore.jp | ✅ | ✅ | ✅ | パッチ `0005` |
| goalpilot.jp | ✅ | ✅ | ✅ | パッチ `0002` |
| machi-list.jp | ✅ | ✅ | ✅ | パッチ `0003` |
| busselect.jp | ✅ | ❌ | ❌ | パッチ `0005` + Site Creator 実トークン |

パッチ適用（最短）:

```powershell
.\scripts\site-analytics\complete-gsc-rollout.ps1
```

または Secret `CROSS_REPO_PAT` → Actions **Apply GSC patches to site repos**

---

## B. DTI / C. ランキング

従来どおり `docs/REMAINING-WORK.md` 参照。
