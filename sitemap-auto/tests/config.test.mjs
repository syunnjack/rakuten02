import test from "node:test"
import assert from "node:assert/strict"
import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { loadConfig } from "../src/config.mjs"

test("loadConfig normalizes site fields", () => {
  const dir = mkdtempSync(join(tmpdir(), "sitemap-auto-"))
  const path = join(dir, "sites.json")
  writeFileSync(
    path,
    JSON.stringify({
      sites: [
        {
          id: "demo",
          siteUrl: "https://demo.example.com",
          indexNowKey: "demokey",
        },
      ],
    }),
  )

  const config = loadConfig(path)
  assert.equal(config.sites.length, 1)
  assert.equal(config.sites[0].siteUrl, "https://demo.example.com/")
  assert.equal(
    config.sites[0].sitemapUrl,
    "https://demo.example.com/sitemap.xml",
  )
  assert.equal(
    config.sites[0].indexNowKeyLocation,
    "https://demo.example.com/demokey.txt",
  )
})
