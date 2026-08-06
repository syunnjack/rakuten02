# プロジェクト引き継ぎ — 2026-08-06

前セッション（フリーズ前）＋本セッションの作業を統合したマスター台帳です。  
**PowerShell 実行はユーザー担当**、**パッチ・ドキュメント・CI・リポジトリ整理はエージェント担当**。

---

## 今日の作業マップ（2本柱）

```
┌─────────────────────────────────────────────────────────────┐
│  A. カスタムドメイン・SEO ロールアウト（Aug 2–5 中心）        │
│     shudenhotel / darekore / goalpilot / machi-list / busselect │
├─────────────────────────────────────────────────────────────┤
│  B. DTI CSV・動画サイト連携（Aug 6）                          │
│     hey-douga-guide / free-sample-hub / rakuten02 パッチ      │
├─────────────────────────────────────────────────────────────┤
│  C. ランキングサイト量産（Aug 5–6・AI 作成、未デプロイ）       │
│     netorare-ranking 他 41 リポジトリ                         │
└─────────────────────────────────────────────────────────────┘
```

---

## A. カスタムドメイン — 現状（エージェント確認 2026-08-06）

| サイト | ドメイン | 公開 | GA4 | GSC | ブロッカー |
|--------|----------|------|-----|-----|------------|
| 終電ホテル | shudenhotel.jp | ✅ | ✅ | ✅ | なし（完了） |
| ダレコレ | darekore.jp | ✅ | ✅ | メタ live | **Search Console で「確認」クリック** |
| GoalPilot | goalpilot.jp | ✅ | ✅ | メタ live | **サイトマップ送信** |
| 町リスト | machi-list.jp | ❌ | 準備済 | 準備済 | **お名前.com DNS**（150.95.255.38 パーキング） |
| バスセレクト | busselect.jp | ❌ | 未 | 未 | **パッチ未適用 + DNS** |

### DNS 未設定（お名前.com）

`machi-list.jp` / `busselect.jp` → 両方 **150.95.255.38（パーキング）**

**machi-list 最短手順:** `patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md`  
（GitHub Pages A レコード 4 つ。Render 移行は任意）

**busselect:** パッチ適用 → Site Creator DNS（`docs/SITE-ROLLOUT.md` 手順 4）

### 確認コマンド（PowerShell）

```powershell
cd C:\Users\syunn\rakuten02
.\scripts\site-analytics\check-sites.ps1
.\scripts\site-analytics\run-rollout.ps1
```

### エージェント実施済み

- PR #10（machi-list Render 案）→ **クローズ**（GitHub Pages 方針に統合済みのため）
- `docs/SITE-ROLLOUT.md` 更新（本ファイルと同期）

---

## B. DTI CSV・動画サイト — 現状

| リポジトリ | 状態 | 次 |
|------------|------|-----|
| **rakuten02** | パッチ master 同梱、PR #15–18 マージ済 | — |
| **hey-douga-guide** | ローカル表示・RSS 同期 OK | [GitHub PR マージ](hey-douga-guide/MERGE-PR.md) |
| **free-sample-hub** | 未セットアップ | [SETUP.md](free-sample-hub/SETUP.md) |

詳細: `patches/DEPLOY-WINDOWS.md` / `patches/STATUS.md`

---

## C. ランキングサイト（41 リポジトリ）

AI が Aug 5–6 に作成。例:

- PHP: `netorare-ranking`, `gyaru-ranking`, `onsen-ranking` …
- Astro: `play-withca-ranking`, `play-withladies-ranking`, `duga-video-ranking` …

**現状:** GitHub にコードのみ。**GitHub Pages 未設定**（`syunnjack.github.io/*` → 404）。**独自ドメイン未割当**。

**次フェーズ（未着手）:**

1. ドメイン一覧の確定（どの repo にどのドメインか）
2. Astro → Vercel/Cloudflare Pages、PHP → Render 等のデプロイ方針
3. `scripts/site-analytics/` キットの横展開（GA4/GSC/sitemap）

一覧取得:

```powershell
gh repo list syunnjack --limit 100 --json name --jq '.[].name | select(test("-ranking$"))'
```

---

## 優先順位（推奨）

| 優先 | 作業 | 担当 | 所要 |
|------|------|------|------|
| 1 | machi-list.jp DNS 変更 | ユーザー @ お名前.com | 5分 |
| 2 | darekore / goalpilot Search Console | ユーザー @ ブラウザ | 各2分 |
| 3 | hey-douga-guide PR マージ | ユーザー @ GitHub | 2分 |
| 4 | busselect パッチ + DNS | ユーザー PowerShell + DNS | 15分 |
| 5 | free-sample-hub セットアップ | ユーザー PowerShell | 20分 |
| 6 | ランキングサイト デプロイ計画 | 要相談 | — |

---

## 主要ファイル

| 用途 | パス |
|------|------|
| ドメインロールアウト手順 | `docs/SITE-ROLLOUT.md` |
| サイト台帳 JSON | `scripts/site-analytics/sites.config.json` |
| DTI ステータス | `patches/STATUS.md` |
| Windows 手順 | `patches/DEPLOY-WINDOWS.md` |
| machi-list DNS | `patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md` |

---

## 関連 PR（rakuten02）

| PR | 内容 | 状態 |
|----|------|------|
| #8–#14 | GA4/GSC 横展開、darekore GSC パッチ | マージ済 |
| #10 | machi-list Render 案 | **クローズ（ superseded ）** |
| #15–#18 | DTI CSV / デプロイガイド | マージ済 |

---

## フリーズ前エージェント

Site rollout: `bc-5ce2714e-0180-40ff-984f-549d73e20b8e`  
DTI CSV: 本セッション Cloud Agent
