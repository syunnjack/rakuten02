import { loadConfig } from "./config.mjs"
import { loadState, saveState } from "./state.mjs"
import { inspectSite } from "./detect.mjs"
import { submitSitemapToGsc } from "./submit-gsc.mjs"
import { submitIndexNow } from "./submit-indexnow.mjs"
import { waitForSitemap } from "./wait.mjs"

function printHelp() {
  console.log(`sitemap-auto — サイトマップ更新検知＆自動送信

使い方:
  sitemap-auto run [--force] [--dry-run] [--site <id>] [--config <path>]
  sitemap-auto check [--site <id>] [--config <path>]
  sitemap-auto submit --force [--dry-run] [--site <id>] [--config <path>]
  sitemap-auto wait --url <sitemapUrl> [--timeout 600]

オプション:
  --force      変更がなくても送信する
  --dry-run    送信せず結果だけ表示
  --site <id>  sites.json の特定サイトだけ処理
  --config     設定ファイルパス（既定: ./sites.json）
  --wait       run 前にサイトマップ到達を待つ（デプロイ待機）
`)
}

function parseArgs(argv) {
  const args = {
    command: "run",
    force: false,
    dryRun: false,
    wait: false,
    site: null,
    config: process.env.SITEMAP_AUTO_CONFIG || "./sites.json",
    url: null,
    timeout: 600,
  }

  const positionals = []
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (token === "--force") args.force = true
    else if (token === "--dry-run") args.dryRun = true
    else if (token === "--wait") args.wait = true
    else if (token === "--site") args.site = argv[++i]
    else if (token === "--config") args.config = argv[++i]
    else if (token === "--url") args.url = argv[++i]
    else if (token === "--timeout") args.timeout = Number(argv[++i])
    else if (token === "--help" || token === "-h") args.command = "help"
    else if (token.startsWith("-")) {
      throw new Error(`不明なオプション: ${token}`)
    } else {
      positionals.push(token)
    }
  }

  if (positionals[0]) args.command = positionals[0]
  return args
}

async function processSites(args) {
  const config = loadConfig(args.config)
  const state = loadState()
  let sites = config.sites.filter((site) => site.enabled !== false)
  if (args.site) {
    sites = sites.filter((site) => site.id === args.site)
    if (sites.length === 0) throw new Error(`サイトが見つかりません: ${args.site}`)
  }

  const summary = []

  for (const site of sites) {
    if (args.wait || args.command === "wait") {
      await waitForSitemap(site.sitemapUrl, args.timeout)
    }

    const inspection = await inspectSite(site, state[site.id])
    const shouldSubmit =
      args.force || args.command === "submit" || inspection.changed

    console.log(`\n=== ${site.name || site.id} ===`)
    console.log(`sitemap: ${site.sitemapUrl}`)
    console.log(`urls: ${inspection.urlCount}`)
    console.log(`hash: ${inspection.hash.slice(0, 12)}…`)
    console.log(
      `changed: ${inspection.changed ? "YES" : "no"}` +
        (inspection.newUrls.length ? ` (+${inspection.newUrls.length} new)` : "") +
        (inspection.updatedUrls.length
          ? ` (~${inspection.updatedUrls.length} lastmod)`
          : ""),
    )

    if (args.command === "check") {
      summary.push({ id: site.id, changed: inspection.changed, submitted: false })
      state[site.id] = {
        ...inspection.snapshot,
        lastCheckedAt: new Date().toISOString(),
      }
      continue
    }

    if (!shouldSubmit) {
      console.log("skip: 変更なし")
      state[site.id] = {
        ...inspection.snapshot,
        lastCheckedAt: new Date().toISOString(),
        lastSubmittedAt: state[site.id]?.lastSubmittedAt ?? null,
      }
      summary.push({ id: site.id, changed: false, submitted: false })
      continue
    }

    const targets = pickSubmitUrls(site, inspection)
    const result = {
      gsc: null,
      indexNow: null,
    }

    if (args.dryRun) {
      console.log(`[dry-run] GSC submit ${site.gscProperty || site.siteUrl} -> ${site.sitemapUrl}`)
      console.log(`[dry-run] IndexNow urls: ${targets.length}`)
      result.gsc = { ok: true, dryRun: true }
      result.indexNow = { ok: true, dryRun: true, count: targets.length }
    } else {
      result.gsc = await submitSitemapToGsc(site)
      console.log(
        result.gsc.ok
          ? `GSC: submitted (${result.gsc.property})`
          : `GSC: skipped — ${result.gsc.reason}`,
      )

      result.indexNow = await submitIndexNow(site, targets)
      console.log(
        result.indexNow.ok
          ? `IndexNow: ${result.indexNow.count} URLs`
          : `IndexNow: skipped — ${result.indexNow.reason}`,
      )
    }

    state[site.id] = {
      ...inspection.snapshot,
      lastCheckedAt: new Date().toISOString(),
      lastSubmittedAt: new Date().toISOString(),
      lastSubmit: {
        gsc: result.gsc,
        indexNow: result.indexNow,
      },
    }
    summary.push({
      id: site.id,
      changed: inspection.changed,
      submitted: true,
      gsc: result.gsc?.ok ?? false,
      indexNow: result.indexNow?.ok ?? false,
    })
  }

  if (!args.dryRun || args.command === "check") {
    saveState(state)
  } else {
    // dry-run でも検知結果は保存しない（再現性のため）。force dry-run は何も書かない。
  }

  console.log("\n--- summary ---")
  for (const row of summary) {
    console.log(
      `${row.id}: changed=${row.changed} submitted=${row.submitted}` +
        (row.submitted
          ? ` gsc=${row.gsc} indexnow=${row.indexNow}`
          : ""),
    )
  }

  return summary
}

function pickSubmitUrls(site, inspection) {
  const hostHome = site.siteUrl.replace(/\/$/, "") + "/"
  const changed = [
    ...new Set([hostHome, ...inspection.newUrls, ...inspection.updatedUrls]),
  ]
  if (changed.length > 1) return changed.slice(0, 10000)
  // 初回や force 時はサイトマップ全URL（上限付き）
  return (inspection.urls.length ? inspection.urls : [hostHome]).slice(0, 10000)
}

export async function main(argv) {
  const args = parseArgs(argv)

  if (args.command === "help") {
    printHelp()
    return
  }

  if (args.command === "wait") {
    if (!args.url) throw new Error("--url が必要です")
    await waitForSitemap(args.url, args.timeout)
    return
  }

  if (!["run", "check", "submit"].includes(args.command)) {
    throw new Error(`不明なコマンド: ${args.command}`)
  }

  if (args.command === "submit") args.force = true

  await processSites(args)
}
