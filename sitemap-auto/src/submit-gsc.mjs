import { readFileSync, existsSync } from "node:fs"
import { GoogleAuth } from "google-auth-library"

const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters"

export async function submitSitemapToGsc(site) {
  const authOptions = buildAuthOptions()
  if (!authOptions) {
    return {
      ok: false,
      reason:
        "GSC_SERVICE_ACCOUNT_JSON / GOOGLE_APPLICATION_CREDENTIALS 未設定",
    }
  }

  const property = site.gscProperty || site.siteUrl
  const feedpath = site.sitemapUrl
  const auth = new GoogleAuth({
    ...authOptions,
    scopes: [GSC_SCOPE],
  })
  const client = await auth.getClient()
  const accessToken = (await client.getAccessToken()).token
  if (!accessToken) {
    return { ok: false, reason: "アクセストークン取得失敗" }
  }

  const endpoint =
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}` +
    `/sitemaps/${encodeURIComponent(feedpath)}`

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
  })

  if (response.status === 204 || response.ok) {
    return { ok: true, property, feedpath, status: response.status }
  }

  const body = await response.text()
  return {
    ok: false,
    reason: `HTTP ${response.status}: ${body.slice(0, 300)}`,
    property,
    feedpath,
  }
}

function buildAuthOptions() {
  const inline = process.env.GSC_SERVICE_ACCOUNT_JSON?.trim()
  if (inline) {
    return { credentials: parseJsonSecret(inline) }
  }

  const keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()
  if (keyFile && existsSync(keyFile)) {
    return { keyFile }
  }

  return null
}

function parseJsonSecret(inline) {
  try {
    return JSON.parse(inline)
  } catch {
    try {
      return JSON.parse(Buffer.from(inline, "base64").toString("utf8"))
    } catch {
      // ファイルパスとして渡されている場合
      if (existsSync(inline)) {
        return JSON.parse(readFileSync(inline, "utf8"))
      }
      throw new Error("GSC_SERVICE_ACCOUNT_JSON の JSON 解析に失敗しました")
    }
  }
}
