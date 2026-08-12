# プロジェクト全体ステータス

最終更新: **2026-08-12**  
**チェックリスト:** `docs/REMAINING-WORK.md`

---

## トラック T — TOGE BASE（イニシャルD）

| 項目 | 状態 |
|------|------|
| ソース `toge-base/` | ✅ |
| 単体 repo / DNS `togepass.jp` | ❌ 切り出し待ち |

---

## トラック A — カスタムドメイン

| サイト | 状態 |
|--------|------|
| shudenhotel | ✅ 完了 |
| darekore | サイトマップ送信待ち |
| goalpilot | サイトマップ送信待ち |
| machi-list | HTTPS ✅ / **GA4 Secret 待ち** |
| busselect | ✅ 公開 / Leaflet ✅ / サイトマップ送信任意 |

---

## トラック B — DTI

| リポジトリ | 状態 |
|------------|------|
| hey-douga-guide | PR #1 マージ済 → **本番 migrate 待ち** |
| free-sample-hub | SETUP 待ち |

---

## ユーザー作業（優先順）

1. machi-list `GOOGLE_ANALYTICS_MEASUREMENT_ID` + Deploy
2. Search Console サイトマップ（darekore / goalpilot / busselect）
3. hey-douga 本番 migrate/import
4. free-sample-hub パッチ適用

---

## エージェント（2026-08-10）

- ライブ確認: 全5ドメイン HTTPS 200
- `docs/REMAINING-WORK.md` 新規
- HANDOFF / STATUS / sites.config 更新
