# free-sample-hub — セットアップ

**現行パッチ:** `0004-Add-DTI-CSV-import-with-https-only-sample-media.patch`  
（= [Devin PR #1](https://github.com/syunnjack/free-sample-hub/pull/1)。旧 0001–0003 は `superseded/`）

```bash
bash scripts/site-analytics/complete-dti-rollout.sh
# または
git clone https://github.com/syunnjack/free-sample-hub.git
cd free-sample-hub
git am /path/to/rakuten02/patches/free-sample-hub/0004-*.patch
```

本番ホスト: **https://sosoru.asia/**（GA4/GSC ライブ済）

ローカル確認は `patches/DEPLOY-WINDOWS.md` セクション 2。
