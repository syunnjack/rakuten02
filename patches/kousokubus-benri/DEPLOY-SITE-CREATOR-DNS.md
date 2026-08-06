# busselect.jp — Site Creator DNS + Secrets 手順

**前提:** パッチ 0002 適用済み・`main` push 済み（2026-08-06）

**ホスティング:** OpenAI Site Creator / vinext（`.openai/hosting.json`）  
**現状 DNS:** `busselect.jp` → `150.95.255.38`（お名前.com パーキング = 未公開）

---

## ステップ 1: Site Creator で環境変数（GA4 / GSC）

GA4 と Search Console は **GitHub Secret ではなく Site Creator のビルド環境**に設定します。

1. ChatGPT → **Sites** → busselect（kousokubus-benri）を開く
2. **Settings** → **Environment variables**
3. 追加:

| 変数 | 値 |
|------|-----|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 測定 ID（`G-XXXXXXXXXX`） |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console → HTML タグ方式の `content` 値 |

4. 保存後、Site を再デプロイ  
   （Settings から Deploy、または `main` へ空コミット push）

### GA4 プロパティ作成（未作成の場合）

1. https://analytics.google.com → プロパティ作成
2. データストリーム → ウェブ → URL: `https://busselect.jp`
3. 測定 ID をコピー → 上記環境変数へ

### Search Console（未登録の場合）

1. https://search.google.com/search-console → プロパティ追加
2. URL プレフィックス: `https://busselect.jp`
3. **HTML タグ**方式 → `content="..."` の値を環境変数へ  
   （DNS が有効になる前でも meta タグはビルド時に埋め込める）

---

## ステップ 2: GitHub Secret（IndexNow のみ）

https://github.com/syunnjack/kousokubus-benri/settings/secrets/actions

| Secret | 値 |
|--------|-----|
| `INDEXNOW_KEY` | `busselectindex2026` |

IndexNow workflow（`.github/workflows/indexnow.yml`）は `main` push 時に実行されます。  
Secret 未設定でもデフォルトキー `busselectindex2026` が使われます（`busselectindex2026.txt` が公開されている必要あり）。

---

## ステップ 3: お名前.com DNS

### 3a. パーキング解除（必須）

お名前.com → ドメイン設定 → DNS レコード → **削除:**

```text
@  A  150.95.255.38
```

> machi-list.jp も同じ IP の場合、**まとめて削除**してください。

### 3b. Site Creator から DNS レコード取得

1. ChatGPT → Sites → busselect → **Settings**
2. **Add domain** → `busselect.jp`（`https://` は付けない）
3. 表示された **CNAME / TXT** をコピー
4. お名前.com の DNS 設定に追加

**お名前.com の Host 欄の注意:**

- Site Creator が `@` や `www` と表示した Host 部分**だけ**を入力（`busselect.jp` 全体は入れない）
- TXT の Value は **コピペ**（手入力しない）

### 3c. 反映確認

DNS 反映まで数分〜最大 48 時間:

```powershell
nslookup busselect.jp
```

`150.95.255.38` が返らなければパーキング解除 OK。  
Site Creator の domain ステータスが **Verified / Active** になるまで待つ。

---

## ステップ 4: 公開確認

```powershell
Invoke-WebRequest https://busselect.jp/ -UseBasicParsing
Invoke-WebRequest https://busselect.jp/sitemap.xml -UseBasicParsing
Invoke-WebRequest https://busselect.jp/busselectindex2026.txt -UseBasicParsing

cd C:\Users\syunn\rakuten02
.\scripts\site-analytics\check-sites.ps1
```

期待結果: HTTP 200、GA4=Y、GSC=Y

---

## ステップ 5: Search Console 仕上げ

1. 所有権が未確認なら **確認** をクリック（meta タグは再デプロイ後に有効）
2. **サイトマップ** → `https://busselect.jp/sitemap.xml` を送信

---

## トラブルシュート

| 症状 | 対処 |
|------|------|
| 依然 `150.95.255.38` | お名前.com で A レコード削除を再確認 |
| HTTP 200 だが GA4 `-` | Site Creator 環境変数 → 再デプロイ |
| GSC `-` | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 設定 → 再デプロイ |
| IndexNow 失敗 | `https://busselect.jp/busselectindex2026.txt` が 200 か確認 |

---

## 関連

- パッチ適用: `APPLY.md`
- 全体台帳: `docs/HANDOFF.md`（rakuten02）
- machi-list DNS（GitHub Pages）: `patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md`
