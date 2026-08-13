import test from "node:test"
import assert from "node:assert/strict"
import { parseSitemap } from "../src/detect.mjs"

test("parse urlset with lastmod", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://example.com/</loc>
      <lastmod>2026-08-12</lastmod>
    </url>
    <url>
      <loc>https://example.com/guides/a</loc>
      <lastmod>2026-08-11</lastmod>
    </url>
  </urlset>`

  const entries = parseSitemap(xml, "https://example.com/")
  assert.equal(entries.length, 2)
  assert.equal(entries[0].loc, "https://example.com/")
  assert.equal(entries[0].lastmod, "2026-08-12")
  assert.equal(entries[1].loc, "https://example.com/guides/a")
})

test("decode xml entities in loc", () => {
  const xml = `<?xml version="1.0"?>
  <urlset>
    <url><loc>https://example.com/a&amp;b</loc></url>
  </urlset>`
  const entries = parseSitemap(xml, "https://example.com/")
  assert.equal(entries[0].loc, "https://example.com/a&b")
})
