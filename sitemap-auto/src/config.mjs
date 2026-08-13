import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

export function loadConfig(configPath = "./sites.json") {
  const absolute = resolve(configPath)
  if (!existsSync(absolute)) {
    throw new Error(
      `設定ファイルがありません: ${absolute}\n` +
        `sites.example.json をコピーして sites.json を作成してください。`,
    )
  }

  const raw = JSON.parse(readFileSync(absolute, "utf8"))
  const sites = Array.isArray(raw) ? raw : raw.sites
  if (!Array.isArray(sites) || sites.length === 0) {
    throw new Error("sites.json に sites 配列が必要です")
  }

  return {
    sites: sites.map((site, index) => normalizeSite(site, index)),
  }
}

function normalizeSite(site, index) {
  if (!site || typeof site !== "object") {
    throw new Error(`sites[${index}] が不正です`)
  }

  const siteUrl = ensureTrailingSlash(site.siteUrl || site.domain || site.url)
  if (!siteUrl) throw new Error(`sites[${index}].siteUrl が必要です`)

  const id = site.id || hostnameId(siteUrl)
  const sitemapUrl =
    site.sitemapUrl || new URL("/sitemap.xml", siteUrl).toString()
  const gscProperty = site.gscProperty || siteUrl
  const indexNowKey = site.indexNowKey || process.env.INDEXNOW_KEY || null
  const indexNowKeyLocation =
    site.indexNowKeyLocation ||
    (indexNowKey ? new URL(`/${indexNowKey}.txt`, siteUrl).toString() : null)

  return {
    id,
    name: site.name || id,
    siteUrl,
    sitemapUrl,
    gscProperty,
    indexNowKey,
    indexNowKeyLocation,
    enabled: site.enabled !== false,
    hosts: site.hosts || undefined,
  }
}

function ensureTrailingSlash(value) {
  if (!value) return null
  const url = value.startsWith("http") ? value : `https://${value}`
  return url.endsWith("/") ? url : `${url}/`
}

function hostnameId(siteUrl) {
  return new URL(siteUrl).hostname.replace(/\./g, "-")
}
