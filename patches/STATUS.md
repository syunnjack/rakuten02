# プロジェクト全体ステータス

最終更新: 2026-08-06  
**マスター引き継ぎ:** `docs/HANDOFF.md`

---

## トラック A — カスタムドメイン（5サイト）

| サイト | ドメイン | 状態 |
|--------|----------|------|
| shudenhotel | shudenhotel.jp | ✅ 完了 |
| darekore | darekore.jp | GSC 確認待ち |
| goalpilot | goalpilot.jp | サイトマップ送信待ち |
| machi-list | machi-list.jp | **HTTPS + Secrets 仕上げ**（DNS 反映済） |
| busselect | busselect.jp | Site Creator env + DNS 待ち |

手順: `docs/SITE-ROLLOUT.md`

---

## トラック B — DTI 動画 CSV

| リポジトリ | 状態 |
|------------|------|
| rakuten02 | ✅ パッチ master |
| hey-douga-guide | ローカル OK → [PR マージ](hey-douga-guide/MERGE-PR.md) |
| free-sample-hub | [SETUP 待ち](free-sample-hub/SETUP.md) |

手順: `patches/DEPLOY-WINDOWS.md`

---

## トラック C — ランキングサイト

- **41 リポジトリ**（`*-ranking`）AI 作成済み
- GitHub Pages / 独自ドメイン **未デプロイ**
- 詳細: `docs/HANDOFF.md` セクション C

---

## エージェント作業ログ（本セッション）

- PR #10 クローズ（machi-list Render 案 → GHPages に統合）
- `docs/HANDOFF.md` 新規
- `docs/SITE-ROLLOUT.md` 現状反映
- DTI パッチ CI / Windows 手順（PR #17–18 マージ済）

---

## ユーザー PowerShell 待ち

1. machi-list **HTTPS + Secrets** → `patches/machi-list/POST-DNS-GITHUB-PAGES.md`
2. darekore / goalpilot Search Console
3. hey-douga-guide **本番 migrate/import**（PR #1 マージ済）
4. busselect Site Creator env + DNS → `patches/kousokubus-benri/DEPLOY-SITE-CREATOR-DNS.md`
5. free-sample-hub セットアップ
