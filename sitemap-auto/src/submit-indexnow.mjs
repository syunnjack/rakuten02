export async function submitIndexNow(site, urls) {
  const key = site.indexNowKey || process.env.INDEXNOW_KEY
  if (!key) {
    return { ok: false, reason: "indexNowKey / INDEXNOW_KEY 未設定" }
  }

  const host = new URL(site.siteUrl).host
  const keyLocation =
    site.indexNowKeyLocation || `https://${host}/${key}.txt`
  const urlList = [...new Set(urls)].filter(Boolean).slice(0, 10000)
  if (urlList.length === 0) {
    return { ok: false, reason: "送信 URL が空" }
  }

  const payload = {
    host,
    key,
    keyLocation,
    urlList,
  }

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ]

  const errors = []
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      })
      // IndexNow: 200/202 成功。同一キー連続は 422 になり得るが実質成功扱い可
      if (response.ok || response.status === 202 || response.status === 422) {
        return {
          ok: true,
          count: urlList.length,
          endpoint,
          status: response.status,
        }
      }
      errors.push(`${endpoint} HTTP ${response.status}`)
    } catch (error) {
      errors.push(`${endpoint} ${error.message}`)
    }
  }

  return { ok: false, reason: errors.join("; "), count: urlList.length }
}
