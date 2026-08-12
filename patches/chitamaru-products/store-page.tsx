import type { Metadata } from "next"
import Link from "next/link"
import storeData from "../data/store-videos.json"
import { resolveVideoAssetUrl } from "../lib/video-assets"
import { storeProductCategories, storeProducts } from "./store-products"

const pageTitle = "ストア | 積み上げログ"
const pageDescription =
  "知多丸ブランドの買い切りツール・Webアプリ・テンプレートをBOOTHで販売。アフィリエイト・せどり・SEO・学習・不動産など16製品を掲載。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/store" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/store", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/og.png"] },
}

interface StoreSlide {
  title: string
  body: string
}

interface StoreVideoBase {
  slug: string
  title: string
  description: string
  language: string
  repositoryUrl: string
  articleUrl: string
  freePreviewSlideCount: number
  slides: StoreSlide[]
  narration: string[]
}

interface PpvVideo extends StoreVideoBase {
  kind: "ppv"
  priceNote: string | null
  boothUrl: string | null
}

interface DemoVideo extends StoreVideoBase {
  kind: "demo"
  ctaLabel: string
  ctaUrl: string
}

type StoreVideo = PpvVideo | DemoVideo

function TrialLink({ href, label }: { href: string; label: string }) {
  const style = { color: "#f97316", textDecoration: "underline" as const }
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {label}
      </a>
    )
  }
  return (
    <Link href={href} style={style}>
      {label}
    </Link>
  )
}

function ProductCard({ product }: { product: (typeof storeProducts)[number] }) {
  return (
    <article className="store-video-card">
      <div
        style={{
          background: product.gradient,
          minHeight: "180px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", color: "white", padding: "24px" }}>
          <div style={{ fontSize: "44px", marginBottom: "10px" }}>{product.emoji}</div>
          <div style={{ fontSize: "16px", fontWeight: "bold", lineHeight: 1.3 }}>{product.label}</div>
          <div style={{ fontSize: "12px", opacity: 0.85, marginTop: "5px" }}>{product.sublabel}</div>
        </div>
      </div>
      <div className="store-video-body">
        <span className="store-video-badge">{product.badge}</span>
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <ul className="store-feature-list">
          {product.features.map((f) => (
            <li key={f}>✅ {f}</li>
          ))}
        </ul>
        <a className="store-buy-button" href={product.boothUrl} target="_blank" rel="noopener noreferrer">
          BOOTHで購入する — {product.price}
        </a>
        <p className="store-price-note">
          {product.priceNote}
          {product.trialUrl && product.trialLabel && (
            <>
              {" | "}
              <TrialLink href={product.trialUrl} label={product.trialLabel} />
            </>
          )}
        </p>
        <a
          className="store-repo-link"
          href={product.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>
      </div>
    </article>
  )
}

export default function StorePage() {
  const allVideos = storeData.videos as StoreVideo[]
  const ppvVideos = allVideos.filter((video): video is PpvVideo => video.kind === "ppv")
  const demoVideos = allVideos.filter((video): video is DemoVideo => video.kind === "demo")

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ストア | 積み上げログ",
    description: pageDescription,
    url: "https://syunnjack.dev/store",
    isPartOf: { "@type": "WebSite", name: "積み上げログ", url: "https://syunnjack.dev" },
    numberOfItems: storeProducts.length + allVideos.length,
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" },
      { "@type": "ListItem", position: 2, name: "ストア", item: "https://syunnjack.dev/store" },
    ],
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "決済方法は何に対応していますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "すべてBOOTHでの購入に対応します。クレジットカード、PayPay、コンビニ払い、キャリア決済など、BOOTHが対応する各種決済方法がご利用いただけます。",
        },
      },
      {
        "@type": "Question",
        name: "購入形式はどのような形ですか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ソフトウェア・テンプレートは買い切りです。動画は単品PPV購入。サブスクリプション不要で、一度購入したソフトウェアは永続利用できます。",
        },
      },
      {
        "@type": "Question",
        name: "無料で試せる商品はありますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "時短レシピ支援アプリ（/tools/recipe）、GoalPilot（goalpilot.jp）、AI Quiz Study（デモ版）、RepoKura（デモ版）など、複数の商品で無料お試し・デモを公開しています。",
        },
      },
      {
        "@type": "Question",
        name: "ソースコードは含まれますか？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Webアプリ・Laravelテンプレート・Windowsアプリはソースコード一式をお渡しします。スプレッドシートテンプレートはコピー用URL、公開キットはZIPダウンロードです。各商品ページの説明をご確認ください。",
        },
      },
    ],
  }

  return (
    <main className="store-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="archive-hero store-hero">
        <p className="eyebrow">
          <span />
          知多丸 ストア
        </p>
        <h1>
          使えるものを、
          <br />
          買い切りで。
        </h1>
        <p>
          syunnjackの全リポジトリから厳選した{storeProducts.length}製品をBOOTHで販売しています。
          アフィリエイト・せどり・SEO・学習・不動産など、目的別に選べます。
        </p>
        <div className="store-payment-note">
          <span>販売</span>
          <strong>BOOTH</strong>
          <span>形式</span>
          <strong>買い切り / PPV</strong>
          <span>製品数</span>
          <strong>{storeProducts.length}点</strong>
        </div>
      </section>

      {/* ── ソフトウェア製品（カテゴリ別）── */}
      {storeProductCategories.map((cat) => {
        const products = storeProducts.filter((p) => p.category === cat.id)
        if (products.length === 0) return null
        return (
          <section className="store-products-section" key={cat.id}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span />
                  {cat.label}
                </p>
                <h2>{cat.label}</h2>
              </div>
              <p>{products.length}製品</p>
            </div>
            <div className="store-video-grid">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </section>
        )
      })}

      {/* ── PPV動画 ── */}
      {ppvVideos.length > 0 && (
        <section className="store-demo-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                限定動画（PPV）
              </p>
              <h2>導入は無料。続きはPPVで。</h2>
            </div>
            <p>各作品の導入部分は無料でご覧いただけます。</p>
          </div>
          <div className="store-video-grid">
            {ppvVideos.map((video) => (
              <article className="store-video-card" key={video.slug}>
                <video
                  className="store-preview-video"
                  controls
                  preload="none"
                  poster={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.png`)}
                  aria-label={`${video.title}の無料プレビュー`}
                >
                  <source src={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`)} type="video/mp4" />
                </video>
                <div className="store-video-body">
                  <span className="store-video-badge">無料プレビュー公開中</span>
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                  {video.boothUrl ? (
                    <>
                      <a className="store-buy-button" href={video.boothUrl} target="_blank" rel="noopener noreferrer">
                        続きをBOOTHで購入する（PPV）
                      </a>
                      {video.priceNote && <p className="store-price-note">{video.priceNote}</p>}
                    </>
                  ) : (
                    <p className="store-price-note store-coming-soon">BOOTH出品準備中</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── プロジェクト紹介動画（無料）── */}
      {demoVideos.length > 0 && (
        <section className="store-demo-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                プロジェクト紹介動画
              </p>
              <h2>公開プロジェクトを動画で紹介</h2>
            </div>
            <p>全編無料でご覧いただけます。</p>
          </div>
          <div className="store-video-grid">
            {demoVideos.map((video) => (
              <article className="store-video-card" key={video.slug}>
                <video
                  className="store-preview-video"
                  controls
                  preload="none"
                  poster={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.png`)}
                  aria-label={`${video.title}の紹介動画`}
                >
                  <source src={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`)} type="video/mp4" />
                </video>
                <div className="store-video-body">
                  <span className="store-video-badge store-video-badge-free">全編無料公開中</span>
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>
                  {video.ctaUrl && (
                    <a className="store-buy-button" href={video.ctaUrl} target="_blank" rel="noopener noreferrer sponsored">
                      {video.ctaLabel ?? "サービスを見る"}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="store-faq">
        <h2>よくある質問</h2>
        <div className="store-faq-grid">
          {faqSchema.mainEntity.map((qa) => (
            <article key={qa.name}>
              <h3>{qa.name}</h3>
              <p>{qa.acceptedAnswer.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
