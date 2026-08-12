export async function waitForSitemap(sitemapUrl, timeoutSec = 600) {
  const deadline = Date.now() + timeoutSec * 1000
  let attempt = 0

  while (Date.now() < deadline) {
    attempt += 1
    try {
      const response = await fetch(sitemapUrl, {
        headers: {
          "user-agent": "sitemap-auto/1.0 (+https://github.com/syunnjack/sitemap-auto)",
        },
      })
      if (response.ok) {
        const text = await response.text()
        if (text.includes("<loc>") || text.includes("<urlset") || text.includes("<sitemapindex")) {
          console.log(`Deployment ready: ${sitemapUrl}`)
          return true
        }
      }
    } catch {
      // retry
    }
    console.log(`Waiting for deployment... (${attempt}) ${sitemapUrl}`)
    await sleep(15000)
  }

  console.log(`Timed out waiting for ${sitemapUrl}; continuing anyway`)
  return false
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
