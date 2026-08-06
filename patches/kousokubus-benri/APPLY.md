# busselect.jp — パッチ適用手順（PowerShell）

**対象リポジトリ:** `syunnjack/kousokubus-benri`（**rakuten02 ではありません**）

**パッチ:** `0002-Add-GA4-Search-Console-and-IndexNow-for-current-layout.patch`  
（0001 は現在の `app/layout.tsx` 構成では失敗します）

---

## よくあるミスと復旧

| 症状 | 原因 | 対処 |
|------|------|------|
| `cd C:\Users\syunn\source\repos\...` が存在しない | パスが古い | `C:\Users\syunn\` を使う |
| `.github/workflows/indexnow.yml: already exists` | **rakuten02** にパッチ適用した | 下記「復旧」参照 |
| `app/layout.tsx: does not exist in index` | 同上（rakuten02 は Next.js サイトではない） | 同上 |
| `src refspec main does not match any`（rakuten02 で push） | rakuten02 のデフォルトブランチは **master** | rakuten02 では `git push origin master`。busselect は **main** |

### rakuten02 に誤って `git am` した場合

```powershell
cd C:\Users\syunn\rakuten02
git am --abort
git status
```

`git status` がクリーンなら rakuten02 は元に戻っています。**rakuten02 を push する必要はありません**（パッチ内容は busselect 用）。

---

## 正しい手順

### 1. kousokubus-benri を clone（初回のみ）

```powershell
cd C:\Users\syunn
git clone https://github.com/syunnjack/kousokubus-benri.git
cd kousokubus-benri
```

### 2. パッチ適用

```powershell
curl.exe -L -o bs.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/kousokubus-benri/0002-Add-GA4-Search-Console-and-IndexNow-for-current-layout.patch"
git am bs.patch
```

成功すると GA4 / Search Console / IndexNow 用の変更がコミットされます。

### 3. push

```powershell
git push origin main
```

### 4. GitHub Secrets（リポジトリ Settings → Secrets）

| Secret | 値 |
|--------|-----|
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID` | GA4 測定 ID |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console 確認トークン |
| `INDEXNOW_KEY` | `busselectindex2026`（任意・デフォルトと同じ） |

### 5. DNS（お名前.com）

`busselect.jp` が **150.95.255.38（パーキング）** の場合、Site Creator / ホスティング側の指示に従い A レコード等を変更。

---

## 確認

```powershell
cd C:\Users\syunn\rakuten02
.\scripts\site-analytics\check-sites.ps1
```

`busselect.jp` が HTTP 200 かつ GA4/GSC が Y になるまで Secrets と DNS を確認してください。
