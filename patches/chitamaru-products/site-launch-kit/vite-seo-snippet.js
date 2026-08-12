// vite-seo-snippet.js — GA4 + IndexNow 注入スクリプト (知多丸テンプレート)
// vite.config.js と一緒に使う Node.js スクリプト

const fs = require("node:fs")
const path = require("node:path")

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function buildSeoHead() {
  const parts = ['    <meta name="robots" content="index, follow">']

  const verification = process.env.GOOGLE_SITE_VERIFICATION?.trim()
  if (verification) {
    parts.push(
      `    <meta name="google-site-verification" content="${escapeHtml(verification)}">`
    )
  }

  const measurementId = process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID?.trim()
  if (measurementId) {
    const id = escapeHtml(measurementId)
    parts.push(
      `    <script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>`
    )
    parts.push(
      `    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');</script>`
    )
  }

  return parts.join("\n")
}

// index.html に注入
const indexPath = path.resolve(__dirname, "index.html")
let html = fs.readFileSync(indexPath, "utf8")

// 既存タグを除去してから再注入（冪等性）
html = html.replace(/\n\s*<meta name="robots"[^>]*>\n?/g, "\n")
html = html.replace(/\n\s*<meta name="google-site-verification"[^>]*>\n?/g, "\n")
html = html.replace(
  /\n\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js[^<]*><\/script>\n?/g,
  "\n"
)
html = html.replace(/\n\s*<script>window\.dataLayer[\s\S]*?<\/script>\n?/g, "\n")

const marker = "</head>"
if (!html.includes(marker)) throw new Error("index.html is missing </head>")

html = html.replace(marker, `\n${buildSeoHead()}\n  ${marker}`)
fs.writeFileSync(indexPath, html)
console.log("SEO head injected into index.html")
