import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

function statePath() {
  return resolve(process.env.SITEMAP_AUTO_STATE || "./.sitemap-auto/state.json")
}

export function loadState() {
  const path = statePath()
  if (!existsSync(path)) return {}
  try {
    return JSON.parse(readFileSync(path, "utf8"))
  } catch {
    return {}
  }
}

export function saveState(state) {
  const path = statePath()
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(state, null, 2)}\n`, "utf8")
}
