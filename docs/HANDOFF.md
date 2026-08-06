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
| ダレコレ | darekore.jp | ✅ | ✅ | ✅ check-sites 全Y | **Search Console でサイトマップ送信** |
| GoalPilot | goalpilot.jp | ✅ | ✅ | ✅ メタ live | **Search Console でサイトマップ送信** |
| 町リスト | machi-list.jp | ❌ | 準備済 | 準備済 | **お名前.com DNS**（Deploy workflow success 済） |
| バスセレクト | busselect.jp | ❌ | 準備済 | 準備済 | **Site Creator 環境変数 + DNS**（パッチ 0002 適用済） |

### DNS 未設定（お名前.com）

`machi-list.jp` / `busselect.jp` → 両方 **150.95.255.38（パーキング）**

**machi-list 最短手順:** `patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md`  
（GitHub Pages A レコード 4 つ。Render 移行は任意）

**busselect:** パッチ適用済 → Site Creator 環境変数 + DNS（`patches/kousokubus-benri/DEPLOY-SITE-CREATOR-DNS.md`。
この「Site Creator」は**OpenAI製**（vinext）で、**Xserverではない**点に注意）

### Xserver アカウント調査（2026-08-06 完了）

実際にXserverを使っているのは **goalpilot.jp のみ**（アカウント `xs501620`）。busselect.jp の
「Site Creator」はOpenAI製の別サービスで無関係。旧アカウント `phg28776` / `phrr806413` は
5リポジトリいずれにも痕跡なし。詳細: `docs/XSERVER-ACCOUNT-AUDIT.md`

### 確認コマンド（PowerShell）

```powershell
cd C:\Users\syunn\rakuten02
.\scripts\site-analytics\check-sites.ps1
.\scripts\site-analytics\run-rollout.ps1
```

### エージェント実施済み

- PR #10（machi-list Render 案）→ **クローズ**（GitHub Pages 方針に統合済みのため）
- PR #21 → **マージ済**（busselect APPLY / DEPLOY-SITE-CREATOR-DNS ガイド）
- `docs/SITE-ROLLOUT.md` 更新（本ファイルと同期）
- お名前.com 一括 DNS 手順: `patches/ONAMAE-DNS-BATCH.md`

---

## B. DTI CSV・動画サイト — 現状

| リポジトリ | 状態 | 次 |
|------------|------|-----|
| **rakuten02** | パッチ master 同梱、PR #15–18 マージ済 | — |
| **hey-douga-guide** | ローカル表示・RSS 同期 OK | [GitHub PR マージ](hey-douga-guide/MERGE-PR.md) |
| **free-sample-hub** | 未セットアップ | [SETUP.md](free-sample-hub/SETUP.md) |

詳細: `patches/DEPLOY-WINDOWS.md` / `patches/STATUS.md`

---

## C. ランキングサイト（41 リポジトリ）— 2026-08-06 スタック調査完了

AI が Aug 5–6 に作成。41件全件クローンして実測（`duga-video-ranking`は旧ドキュメントの誤りでAstroではなくLaravel/PHP）:

- **PHP（Laravel）26件**: `netorare-ranking`, `gyaru-ranking`, `duga-video-ranking` …
- **Astro（SSR、`@astrojs/vercel`組み込み済み）15件**: `play-withca-ranking`, `play-withladies-ranking`, `gyakyu-netorare-ranking` …

**現状:** GitHub にコードのみ。**デプロイ設定ゼロ**（CNAME/vercel.json/wrangler.toml いずれも未設置）。**独自ドメイン未割当**。

**デプロイ方針（確定・提案）:** Astro → **Vercel**（コード変更不要）、PHP/Laravel → **Render**（shudenhotel/machi-listと同じ運用実績）

**未確定（ユーザー判断待ち）:** 41件分のドメイン取得の要否・パイロット展開の是非。詳細: `docs/RANKING-SITES.md`（生データ: `docs/ranking-audit-raw.tsv`）

---

## 優先順位（推奨）

| 優先 | 作業 | 担当 | 所要 |
|------|------|------|------|
| 1 | machi-list.jp DNS 変更 | ユーザー @ お名前.com | 5分 |
| 2 | darekore / goalpilot Search Console | ユーザー @ ブラウザ | 各2分 |
| 3 | hey-douga-guide PR マージ | ユーザー @ GitHub | 2分 |
| 4 | busselect **Site Creator env + DNS** | ユーザー @ ChatGPT Sites + お名前.com | 15分 |
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
| busselect DNS + Secrets | `patches/kousokubus-benri/DEPLOY-SITE-CREATOR-DNS.md` |
| お名前.com 一括（両ドメイン） | `patches/ONAMAE-DNS-BATCH.md` |

---

## 関連 PR（rakuten02）

| PR | 内容 | 状態 |
|----|------|------|
| #8–#14 | GA4/GSC 横展開、darekore GSC パッチ | マージ済 |
| #10 | machi-list Render 案 | **クローズ（ superseded ）** |
| #15–#18 | DTI CSV / デプロイガイド | マージ済 |
| #20 | busselect patch 0002 | マージ済 |
| #21 | busselect APPLY + Site Creator DNS ガイド | マージ済 |

---

## フリーズ前エージェント

Site rollout: `bc-5ce2714e-0180-40ff-984f-549d73e20b8e`  
DTI CSV: 本セッション Cloud Agent
