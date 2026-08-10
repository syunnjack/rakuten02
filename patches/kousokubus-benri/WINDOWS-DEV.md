# busselect — Windows で `npm run dev` が動かない場合

## 症状

```text
'WRANGLER_LOG_PATH' は、内部コマンドまたは外部コマンド…として認識されていません。
```

`package.json` の `VAR=value command` 形式は **Linux/macOS 専用**で、PowerShell / CMD では使えません。

---

## すぐ動かす（パッチ適用前）

PowerShell:

```powershell
cd C:\Users\syunn\kousokubus-benri
$env:WRANGLER_LOG_PATH = ".wrangler\wrangler.log"
npx vinext dev
```

---

## 恒久修正（パッチ 0004）

```powershell
cd C:\Users\syunn\kousokubus-benri
curl.exe -L -o win.patch "https://github.com/syunnjack/rakuten02/raw/master/patches/kousokubus-benri/0004-Fix-Windows-npm-dev-scripts-with-cross-env.patch"
git am win.patch
npm install
git push origin main
```

`cross-env` により `npm run dev` / `build` / `start` が Windows でも動作します。

---

## `git am` だけ実行した場合

引数なしの `git am` はパッチ入力待ちです。**Ctrl+C** で中断し、`git status` がクリーンか確認してください。
