#!/usr/bin/env node
import { main } from "../src/cli.mjs"

main(process.argv.slice(2)).catch((error) => {
  console.error(`[sitemap-auto] ${error.message}`)
  if (process.env.DEBUG) console.error(error)
  process.exit(1)
})
