# machi-list.jp — 独自ドメイン公開（GitHub Pages 不使用）

GitHub Pages の `syunnjack.github.io` ではなく、`machi-list.jp` を Render の Static Site で公開します。  
shudenhotel.jp と同じく、お名前.com の DNS を Render 向けに設定します。

## 1. パッチ適用

```powershell
cd C:\Users\syunn\source\repos\machi-list
curl.exe -L -o render-domain.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/machi-list/0002-Switch-to-Render-custom-domain.patch"
git am render-domain.patch
git push origin main
```

## 2. Render で Blueprint 作成

1. https://dashboard.render.com/ → **New** → **Blueprint**
2. GitHub の `syunnjack/machi-list` を選択
3. `render.yaml` を読み込んで **Apply**
4. Environment に次を設定（Build 時に GA4 / Search Console タグが HTML に埋め込まれます）:

| 変数名 | 例 |
|--------|-----|
| `GOOGLE_ANALYTICS_MEASUREMENT_ID` | `G-XXXXXXXX` |
| `GOOGLE_SITE_VERIFICATION` | Search Console HTML タグの content 値 |

5. デプロイ完了後、Render の **Custom Domains** に `machi-list.jp` が表示されることを確認

## 3. お名前.com DNS（パーキング解除）

**削除:**

```text
@  A  150.95.255.38   ← お名前.com パーキング（必ず削除）
```

**追加（Render の画面に表示された値を優先。例）:**

```text
ホスト名: @
TYPE: A
VALUE: 216.24.57.1
TTL: 3600

ホスト名: www
TYPE: CNAME
VALUE: machi-list.onrender.com   ← Render が表示するホスト名
TTL: 3600
```

Render の Custom Domains 画面に出る A/CNAME をそのまま使ってください。

## 4. GitHub Pages を無効化

Render に切り替えたら、GitHub Pages は使いません。

1. https://github.com/syunnjack/machi-list/settings/pages → **Source: None**
2. パッチ 0002 で `CNAME` と `pages.yml` は削除済み

IndexNow は `.github/workflows/indexnow.yml` のまま動きます（`machi-list.jp` を監視）。

## 5. GitHub Secrets（IndexNow 用）

https://github.com/syunnjack/machi-list/settings/secrets/actions

| Secret | 値 |
|--------|-----|
| `INDEXNOW_KEY` | `machilistindex2026` |

GA4 / Search Console は **Render の Environment** に設定（GitHub Secrets ではビルドされません）。

## 6. 公開後チェック（PowerShell）

```powershell
nslookup machi-list.jp
# → 150.95.255.38 ではなく Render の IP

Invoke-WebRequest -Uri "https://machi-list.jp/" -UseBasicParsing
Invoke-WebRequest -Uri "https://machi-list.jp/sitemap.xml" -UseBasicParsing
Invoke-WebRequest -Uri "https://machi-list.jp/machilistindex2026.txt" -UseBasicParsing
```

## 7. Search Console

1. プロパティ追加: `https://machi-list.jp/`
2. 所有権確認: HTML タグ（`GOOGLE_SITE_VERIFICATION` を Render に設定済みなら再デプロイ後に確認）
3. サイトマップ送信: `https://machi-list.jp/sitemap.xml`
