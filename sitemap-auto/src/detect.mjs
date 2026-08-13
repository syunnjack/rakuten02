import { createHash } from "node:crypto"

export async function inspectSite(site, previous = null) {
  const response = await fetch(site.sitemapUrl, {
    headers: {
      "user-agent": "sitemap-auto/1.0 (+https://github.com/syunnjack/sitemap-auto)",
      accept: "application/xml,text/xml,*/*",
    },
    redirect: "follow",
  })

  if (!response.ok) {
    throw new Error(
      `${site.id}: sitemap 取得失敗 HTTP ${response.status} ${site.sitemapUrl}`,
    )
  }

  const xml = await response.text()
  const entries = parseSitemap(xml, site.siteUrl)
  const urls = entries.map((entry) => entry.loc)
  const hash = createHash("sha256").update(xml).digest("hex")
  const etag = response.headers.get("etag")
  const lastModifiedHeader = response.headers.get("last-modified")

  const previousUrls = new Set(previous?.urls ?? [])
  const previousLastmods = new Map(
    Object.entries(previous?.lastmods ?? {}),
  )

  const newUrls = urls.filter((url) => !previousUrls.has(url))
  const updatedUrls = entries
    .filter((entry) => {
      if (!entry.lastmod) return false
      const prev = previousLastmods.get(entry.loc)
      return prev && prev !== entry.lastmod
    })
    .map((entry) => entry.loc)

  const changed =
    !previous ||
    previous.hash !== hash ||
    newUrls.length > 0 ||
    updatedUrls.length > 0

  const lastmods = Object.fromEntries(
    entries
      .filter((entry) => entry.lastmod)
      .map((entry) => [entry.loc, entry.lastmod]),
  )

  return {
    changed,
    hash,
    etag,
    lastModifiedHeader,
    urlCount: urls.length,
    urls,
    newUrls,
    updatedUrls,
    snapshot: {
      hash,
      etag,
      lastModifiedHeader,
      urlCount: urls.length,
      urls,
      lastmods,
      sitemapUrl: site.sitemapUrl,
    },
  }
}

export function parseSitemap(xml, siteUrl) {
  const isIndex = /<sitemapindex[\s>]/i.test(xml)
  if (isIndex) {
    // インデックスの場合は loc を収集（ネスト取得は run 側で必要なら拡張）
    // ここでは子サイトマップ URL をそのまま監視対象の「エントリ」にせず、
    // 呼び出し側が sitemapUrl を直接指定することを推奨。
    // 子を flatten したい場合は expandSitemapIndex を使う。
  }

  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) =>
    decodeXml(m[1].trim()),
  )
  const lastmods = [...xml.matchAll(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/gi)].map(
    (m) => m[1].trim(),
  )

  // urlset: loc と lastmod は兄弟なのでざっくりペアリング
  const urlBlocks = [
    ...xml.matchAll(/<url\b[\s\S]*?<\/url>/gi),
  ]

  if (urlBlocks.length > 0) {
    return urlBlocks
      .map((block) => {
        const loc = block[0].match(/<loc>\s*([^<]+?)\s*<\/loc>/i)?.[1]?.trim()
        const lastmod = block[0]
          .match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/i)?.[1]
          ?.trim()
        if (!loc) return null
        return { loc: decodeXml(loc), lastmod: lastmod || null }
      })
      .filter(Boolean)
  }

  // sitemapindex や単純リスト
  return locs.map((loc, index) => ({
    loc,
    lastmod: lastmods[index] || null,
    kind: isIndex ? "sitemap" : "url",
    siteUrl,
  }))
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}
