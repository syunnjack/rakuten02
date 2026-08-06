# お名前.com DNS 一括変更（machi-list + busselect）

**対象:** `machi-list.jp` / `busselect.jp` — 両方 **150.95.255.38（パーキング）** のまま

お名前.com に **1 回ログイン** して両ドメインをまとめて直せます。

---

## 共通: パーキング解除（両ドメイン）

各ドメインの DNS 設定で **削除:**

```text
@  A  150.95.255.38
```

---

## machi-list.jp → GitHub Pages

**追加（A レコード ×4）:**

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

**www がある場合:**

```text
www  CNAME  syunnjack.github.io
```

**GitHub 側:** https://github.com/syunnjack/machi-list/settings/pages  
Custom domain = `machi-list.jp`、Enforce HTTPS ON

**Secrets（未設定なら）:** https://github.com/syunnjack/machi-list/settings/secrets/actions  
`GOOGLE_ANALYTICS_MEASUREMENT_ID` / `GOOGLE_SITE_VERIFICATION` / `INDEXNOW_KEY`

詳細: `patches/machi-list/DEPLOY-GITHUB-PAGES-DNS.md`

---

## busselect.jp → Site Creator

**追加:** ChatGPT → Sites → busselect → Settings → **Add domain** → `busselect.jp`  
→ 表示された CNAME / TXT をお名前.com に追加（値は Site Creator 画面の指示に従う）

**Site Creator 環境変数（別画面）:**

| 変数 | 用途 |
|------|------|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console |

**GitHub Secret（IndexNow）:** https://github.com/syunnjack/kousokubus-benri/settings/secrets/actions  
`INDEXNOW_KEY` = `busselectindex2026`

詳細: `patches/kousokubus-benri/DEPLOY-SITE-CREATOR-DNS.md`

---

## 反映確認（PowerShell）

```powershell
nslookup machi-list.jp
nslookup busselect.jp
# → どちらも 150.95.255.38 ではないこと

cd C:\Users\syunn\rakuten02
git pull origin master
.\scripts\site-analytics\check-sites.ps1
```

---

## 優先順位

1. **machi-list** — GitHub Pages の A レコードは固定値なので先に設定しやすい
2. **busselect** — Site Creator の Add domain 画面で DNS 値をコピーしてから追加
